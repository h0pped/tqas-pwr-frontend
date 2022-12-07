import React, { useRef, useState, useEffect } from 'react';
import {
  FormControl,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';

import OpenQuestion from './OpenQuestion.js';
import SingleChoiceQuestion from './SingleChoiceQuestion.js';

const SingleChoiceWithAdditionalField = ({
  question,
  options,
  onChangeHandler,
  onInternalQuestionChangeHandler,
  sectionTitle,
  disabled,
  answer,
}) => {
  const [parentChoice, setParentChoice] = useState(null);
  const formRadioGroup = useRef(null);
  const [, setIsChosenWithAdditionalField] = useState(null);
  const [shownAdditionalQuestion, setShownAdditionalQuestion] = useState(null);

  useEffect(() => {
    if (typeof answer === 'object' && answer.answer) {
      const option = options.find((option) => option.answer === answer.answer);
      setParentChoice(answer.answer);
      setIsChosenWithAdditionalField(true);
      setShownAdditionalQuestion(option.questions);
    }
  }, []);

  const handleChooseAdditionalField = (e, question, option) => {
    setParentChoice(option.answer);
    setShownAdditionalQuestion(option.questions);
    setIsChosenWithAdditionalField(true);
  };
  const handleChooseDefaultOption = (e) => {
    onChangeHandler(e);
    setIsChosenWithAdditionalField(null);
    setShownAdditionalQuestion(null);
  };
  return (
    <FormControl sx={{ display: 'flex', width: '100%', my: 5 }}>
      <Typography sx={{ display: 'inline-block' }}>{question}</Typography>

      <RadioGroup
        name="radio-buttons-group"
        id={question}
        onChange={onChangeHandler}
        sx={{ display: 'flex' }}
        row
        ref={formRadioGroup}
        value={
          typeof answer === 'object' && answer.answer ? answer?.answer : answer
        }
      >
        {options.map((option) => {
          if (typeof option === 'string') {
            return (
              <FormControlLabel
                id={question}
                key={option}
                value={option}
                control={
                  <Radio
                    id={question}
                    disabled={disabled}
                    onClick={(e) => handleChooseDefaultOption(e)}
                  />
                }
                label={option}
                onClick={(e) => handleChooseDefaultOption(e)}
                sx={{ display: 'inline' }}
              />
            );
          }
          if (typeof option === 'object') {
            return (
              <React.Fragment key={option.answer}>
                <FormControlLabel
                  id={question.answer}
                  key={option.answer}
                  value={option.answer}
                  control={
                    <Radio
                      disabled={disabled}
                      id={question.answer}
                      onClick={(e) =>
                        handleChooseAdditionalField(e, question, option)
                      }
                    />
                  }
                  label={option.answer}
                  onClick={(e) =>
                    handleChooseAdditionalField(e, question, option)
                  }
                  sx={{ display: 'inline' }}
                />

                {shownAdditionalQuestion &&
                  shownAdditionalQuestion.length > 0 &&
                  shownAdditionalQuestion.map((internalQuestion) => {
                    if (internalQuestion.question_type === 'open') {
                      return (
                        <OpenQuestion
                          disabled={disabled}
                          question={internalQuestion.question_text}
                          key={`${internalQuestion.question_text}_${internalQuestion.qusetion_type}`}
                          onChangeHandler={(e) =>
                            onInternalQuestionChangeHandler(
                              e,
                              question,
                              parentChoice,
                              sectionTitle
                            )
                          }
                          answer={
                            answer && answer[internalQuestion?.question_text]
                              ? answer[internalQuestion?.question_text]
                              : ''
                          }
                        />
                      );
                    }
                    if (internalQuestion.question_type === 'single choice') {
                      return (
                        <SingleChoiceQuestion
                          disabled={disabled}
                          question={internalQuestion.question_text}
                          key={`${internalQuestion.question_text}_${internalQuestion.qusetion_type}`}
                          onChangeHandler={onChangeHandler}
                          options={internalQuestion.answer_options}
                          value={internalQuestion.answer}
                        />
                      );
                    }
                    return null;
                  })}
              </React.Fragment>
            );
          }
          return null;
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default SingleChoiceWithAdditionalField;
