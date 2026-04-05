package com.survey.service;

import com.survey.dto.SubmitResponseRequest;
import com.survey.entity.*;
import com.survey.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Handles public survey response submissions.
 */
@Service
@RequiredArgsConstructor
public class ResponseService {

    private final SurveyRepository surveyRepository;
    private final ResponseRepository responseRepository;
    private final AnswerRepository answerRepository;

    /**
     * Submit a response to a published survey.
     *
     * @param publicId  the survey's UUID
     * @param request   map of questionId → answer (text or optionId)
     * @param clientIp  respondent IP address
     */
    @Transactional
    public void submitResponse(String publicId, SubmitResponseRequest request, String clientIp) {
        Survey survey = surveyRepository.findByPublicIdAndPublishedTrue(publicId)
                .orElseThrow(() -> new RuntimeException("Survey not found or not published"));

        // Build the Response entity
        Response response = Response.builder()
                .survey(survey)
                .respondentIp(clientIp)
                .build();

        List<Answer> answers = new ArrayList<>();

        for (Question question : survey.getQuestions()) {
            Map<Long, String> submittedAnswers = request.getAnswers();
            String value = submittedAnswers.get(question.getId());

            if (value == null || value.isBlank()) {
                if (question.isRequired()) {
                    throw new RuntimeException("Question " + question.getId() + " is required.");
                }
                continue;
            }

            Answer answer = new Answer();
            answer.setResponse(response);
            answer.setQuestion(question);

            if (question.getQuestionType() == Question.QuestionType.TEXT) {
                answer.setTextAnswer(value);
            } else if (question.getQuestionType() == Question.QuestionType.MCQ) {
                // value is the selected option id
                Long optionId = Long.parseLong(value);
                Option selected = question.getOptions().stream()
                        .filter(o -> o.getId().equals(optionId))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Invalid option: " + optionId));
                answer.setSelectedOption(selected);
            }

            answers.add(answer);
        }

        response.setAnswers(answers);
        responseRepository.save(response);
    }
}
