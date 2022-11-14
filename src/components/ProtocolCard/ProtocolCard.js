import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

import ArticleIcon from '@mui/icons-material/Article';
import { Divider } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export default function ProtocolCard({ protocol, setOpenProtcolForm }) {
  const { t } = useTranslation();

  var members = protocol.evaluation_team.join(', ');
  return (
    <Box
      onClick={() => {
        setOpenProtcolForm(true);
      }}
      sx={{
        p: 2,
        backgroundColor: '#ffffff',
        border: 'solid 0.5px rgba(235, 235, 235)',
        color: '#000000',
        borderRadius: 0.5,
        height: 'max-content',
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
          <AccountBoxIcon
            sx={{
              color: '#D9372A',
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', height: '1.5rem' }}
          >
            Evaluation
          </Typography>
          <Typography
            sx={{
              height: '1.5rem',
              fontSize: '1rem',
            }}
          >
            {`${protocol.evaluatee_academic_title} ${protocol.evaluatee_first_name} ${protocol.evaluatee_last_name}`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Chip
            sx={{ color: '#000000' }}
            size="small"
            label={protocol.evaluation_status}
          />
        </Box>
      </Box>
      <Chip
        sx={{ mt: 2 }}
        icon={<CalendarMonthIcon />}
        label={protocol.assessment_semester}
        variant="outlined"
      />
      <Box sx={{ mt: 2, p: 1, borderRadius: 1, backgroundColor: '#f4f5f7' }}>
        {protocol.courses.map((course) => (
          <Box>
            <Box sx={{ display: 'flex', flexBasis: 'row', gap: 1, mt: 1 }}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {course.course_code}:
              </Typography>
              <Typography key={course.course_name}>
                {course.course_name}
              </Typography>
            </Box>
            <Typography variant="subtitle2">{course.course_details}</Typography>
          </Box>

        ))}
      </Box>
      <Box sx={{ mt: 2, p: 1, borderRadius: 1, backgroundColor: '#f4f5f7' }}>
        <Typography sx={{ fontWeight: 'bold' }}>Evaluation team:</Typography>
        <Box>
          <Box sx={{ display: 'flex', flexBasis: 'row', gap: 1, mt: 1 }}>
            <Typography>
              {members}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
