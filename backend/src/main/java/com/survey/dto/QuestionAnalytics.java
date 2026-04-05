package com.survey.dto;

import com.survey.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Analytics for a single question.
 *
 * <ul>
 *   <li>MCQ  questions → {@code optionCounts} is populated; {@code textAnswers} is null.</li>
 *   <li>TEXT questions → {@code textAnswers} is populated; {@code optionCounts} is null.</li>
 * </ul>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionAnalytics {

    private Long questionId;
    private String questionText;
    private Question.QuestionType questionType;

    /** Option-level vote counts — populated for MCQ questions. */
    private List<OptionCount> optionCounts;

    /** Raw text answers — populated for TEXT questions. */
    private List<String> textAnswers;
}
