import { FormControl, Input, Typography } from '@mui/material';

const OpenQuestion = ({ question, onChangeHandler }) => (
  <FormControl sx={{ display: 'flex', width: '100%', my: 5 }}>
    <Typography sx={{ display: 'inline-block' }}>{question}</Typography>
    <Input
      id={question}
      aria-describedby="my-helper-text"
      onChange={onChangeHandler}
    />
  </FormControl>
);

export default OpenQuestion;
