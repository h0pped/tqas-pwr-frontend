import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

import AssessmentIcon from '@mui/icons-material/Assessment';
import DomainIcon from '@mui/icons-material/Domain';

export default function AssessmentCard({
  id,
  semester,
  status,
  department,
  setId,
  isSelected,
  numberOfEvaluatees,
}) {
  const { t } = useTranslation();

  return (
    <Box
      onClick={() => {
        setId(id);
      }}
      sx={{
        p: 2,
        backgroundColor: '#ffffff',
        background: isSelected
          ? 'linear-gradient(45deg, rgba(217,55,42,1) 0%, rgba(255,128,118,1) 70%, rgba(217,55,42,1) 100%)'
          : null,
        border: isSelected
          ? 'solid 0.5px #D9372A'
          : 'solid 0.5px rgba(235, 235, 235)',
        color: isSelected ? '#ffffff' : '#000000',
        borderRadius: 0.5,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          backgroundColor: 'rgba(235, 235, 235, 0.53)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            p: 0.5,
            borderRadius: 2,
            backgroundColor: '#fdf0ef',
            width: '3rem',
            height: '3rem',
          }}
        >
          <AssessmentIcon
            sx={{
              color: '#D9372A',
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', height: '1.5rem' }}
          >
            {t('assesment_card_assessment')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.5,
            }}
          >
            <Typography
              sx={{
                height: '1.5rem',
                fontSize: '1rem',
              }}
            >
              {semester}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 1.5,
          mb: 1.5,
          display: 'flex',
          flexDirection: 'row',
          gap: 0.8,
        }}
      >
        <DomainIcon />
        <Typography
          variant="subtitle2"
          sx={{
            height: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {department}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Chip
          sx={{ color: isSelected ? '#ffffff' : '#000000' }}
          size="small"
          label={status}
        />
        <Typography variant="subtitle1">
          {`${numberOfEvaluatees} ${t('assessment_card_evaluatees')}`}
        </Typography>
      </Box>
    </Box>
  );
}
