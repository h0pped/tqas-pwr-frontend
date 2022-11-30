import React, { useRef, useState } from 'react';
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
}) => {
  const [parentChoice, setParentChoice] = useState(null);
  const formRadioGroup = useRef(null);
  const [, setIsChosenWithAdditionalField] = useState(null);
  const [shownAdditionalQuestion, setShownAdditionalQuestion] = useState(null);

  const handleChooseAdditionalField = (question, option) => {
    setParentChoice(option.answer);
    setShownAdditionalQuestion(option.questions);
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
                      onClick={() =>
                        handleChooseAdditionalField(question, option)
                      }
                    />
                  }
                  label={option.answer}
                  onClick={() => handleChooseAdditionalField(question, option)}
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
