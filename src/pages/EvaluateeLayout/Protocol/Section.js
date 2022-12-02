import { Typography, Box } from '@mui/material';

import OpenQuestion from './OpenQuestion.js';
import SingleChoiceQuestion from './SingleChoiceQuestion.js';
import SingleChoiceWithAdditionalField from './SingleChoiceWithAdditionalField.js';

const Section = ({
  sectionTitle,
  sectionData,
  onChangeHandler,
  onInternalQuestionChangeHandler,
  sectionTitleUnformatted,
  isHeadOfTeam,
}) => (
  <Box>
    <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2 }}>
      {sectionTitle}
    </Typography>
    <Box sx={{ mx: 2 }}>
      {sectionData.map((question) => {
        if (question.question_type === 'open') {
          return (
            <OpenQuestion
              disabled={!isHeadOfTeam}
              question={question.question_text}
              answer={question.answer}
              key={`${question.question_text}_${question.question_type}`}
              onChangeHandler={onChangeHandler}
            />
          );
        }
        if (question.question_type === 'single choice') {
          return (
            <SingleChoiceQuestion
              disabled={!isHeadOfTeam}
              question={question.question_text}
              key={`${question.question_text}_${question.question_type}`}
              onChangeHandler={onChangeHandler}
              options={question.answer_options}
            />
          );
        }
        if (question.question_type === 'single choice with additional field') {
          return (
            <SingleChoiceWithAdditionalField
              disabled={!isHeadOfTeam}
              question={question.question_text}
              options={question.answer_options}
              onChangeHandler={onChangeHandler}
              sectionTitle={sectionTitleUnformatted}
              onInternalQuestionChangeHandler={onInternalQuestionChangeHandler}
              key={`${question.question_text}_${question.question_type}`}
            />
          );
        }
        return null;
      })}
    </Box>
  </Box>
);

export default Section;
