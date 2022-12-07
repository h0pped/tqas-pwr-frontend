import {
  FormControl,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';

const SingleChoiceQuestion = ({
  question,
  onChangeHandler,
  options,
  disabled,
  answer,
}) => (
  <FormControl sx={{ display: 'flex', width: '100%', my: 5 }}>
    <Typography sx={{ display: 'inline-block' }}>{question}</Typography>

    <RadioGroup
      name="radio-buttons-group"
      id={question}
      onChange={onChangeHandler}
      sx={{ display: 'flex' }}
      row
      value={answer}
    >
      {options.map((option) => (
        <FormControlLabel
          id={question}
          key={option}
          value={option}
          control={<Radio id={question} disabled={disabled} />}
          label={option}
          sx={{ display: 'inline' }}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

export default SingleChoiceQuestion;
