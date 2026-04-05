package com.survey.service;

import com.survey.dto.*;
import com.survey.entity.*;
import com.survey.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Aggregates survey response data for analytics visualisation.
 */
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SurveyRepository surveyRepository;
    private final ResponseRepository responseRepository;
    private final AnswerRepository answerRepository;

    /**
     * Build full analytics for a survey owned by the given admin.
     */
    public SurveyAnalyticsResponse getSurveyAnalytics(Long surveyId, Long adminId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found"));

        if (!survey.getAdmin().getId().equals(adminId)) {
            throw new RuntimeException("Access denied");
        }

        long totalResponses = responseRepository.countBySurveyId(surveyId);

        List<QuestionAnalytics> questionAnalytics = survey.getQuestions().stream()
                .map(q -> buildQuestionAnalytics(q))
                .collect(Collectors.toList());

        return SurveyAnalyticsResponse.builder()
                .surveyId(survey.getId())
                .surveyTitle(survey.getTitle())
                .totalResponses(totalResponses)
                .questions(questionAnalytics)
                .build();
    }

    private QuestionAnalytics buildQuestionAnalytics(Question question) {
        QuestionAnalytics.QuestionAnalyticsBuilder builder = QuestionAnalytics.builder()
                .questionId(question.getId())
                .questionText(question.getText())
                .questionType(question.getQuestionType());

        if (question.getQuestionType() == Question.QuestionType.MCQ) {
            // Aggregate MCQ option counts using JPQL query
            List<Object[]> rows = answerRepository
                    .countOptionSelectionsByQuestion(question.getId());

            List<OptionCount> counts = rows.stream()
                    .map(row -> OptionCount.builder()
                            .optionId((Long) row[0])
                            .optionText((String) row[1])
                            .count((Long) row[2])
                            .build())
                    .collect(Collectors.toList());

            // Include zero-count options too
            for (Option opt : question.getOptions()) {
                boolean found = counts.stream()
                        .anyMatch(c -> c.getOptionId().equals(opt.getId()));
                if (!found) {
                    counts.add(OptionCount.builder()
                            .optionId(opt.getId())
                            .optionText(opt.getText())
                            .count(0L)
                            .build());
                }
            }

            builder.optionCounts(counts);
        } else {
            // TEXT: collect all text answers
            List<String> textAnswers = answerRepository
                    .findByQuestionId(question.getId())
                    .stream()
                    .map(Answer::getTextAnswer)
                    .filter(t -> t != null && !t.isBlank())
                    .collect(Collectors.toList());

            builder.textAnswers(textAnswers);
        }

        return builder.build();
    }
}
