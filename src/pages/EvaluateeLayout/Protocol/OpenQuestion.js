import { FormControl, Input, Typography } from '@mui/material';

const OpenQuestion = ({ question, onChangeHandler, answer, disabled }) => (
  <FormControl sx={{ display: 'flex', width: '100%', my: 5 }}>
    <Typography sx={{ display: 'inline-block' }}>{question}</Typography>
    <Input
      id={question}
      aria-describedby="my-helper-text"
      value={answer}
      onChange={onChangeHandler}
      disabled={disabled}
    />
  </FormControl>
);

export default OpenQuestion;
