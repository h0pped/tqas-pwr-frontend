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
  onInternalSectionChangeHandler,
}) => {
  const onInternalChangeSection = (e, sectionKey, sectionValue) => {
    onInternalSectionChangeHandler(
      e,
      sectionTitleUnformatted,
      sectionKey,
      sectionValue
    );
  };
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2 }}>
        {sectionTitle}
      </Typography>
      <Box sx={{ mx: 2 }}>
        {sectionData.map((question) => {
          if (!question.question_type && !question.question_text) {
            const sections = question;
            return Object.entries(sections).map(([key, value]) => (
              <Section
                sectionTitle={key}
                sectionData={value}
                sectionTitleUnformatted={key}
                key={key}
                onChangeHandler={(e) => onInternalChangeSection(e, key, value)}
                onInternalQuestionChangeHandler={
                  onInternalQuestionChangeHandler
                }
                isHeadOfTeam={isHeadOfTeam}
              />
            ));
          }
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
                answer={question.answer}
              />
            );
          }
          if (
            question.question_type === 'single choice with additional field'
          ) {
            return (
              <SingleChoiceWithAdditionalField
                disabled={!isHeadOfTeam}
                question={question.question_text}
                options={question.answer_options}
                onChangeHandler={onChangeHandler}
                sectionTitle={sectionTitleUnformatted}
                onInternalQuestionChangeHandler={
                  onInternalQuestionChangeHandler
                }
                answer={question.answer || question?.answer?.answer}
                key={`${question.question_text}_${question.question_type}`}
              />
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
};
export default Section;
