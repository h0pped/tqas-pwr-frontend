import { Typography, Box } from '@mui/material';

import { useTranslation } from 'react-i18next';

const TeamMembers = ({ evaluationTeam }) => {
  const { t } = useTranslation();

  const mappedUsers = evaluationTeam.map(
    ({ is_head_of_team: isHead, user_full: user }) => ({
      firstName: user.first_name,
      lastName: user.last_name,
      title: user.academic_title,
      isHead,
    })
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {t('team_members_header')}
      </Typography>
      {mappedUsers.map(({ firstName, lastName, title, isHead }, index) => (
        <Typography
          key={firstName + lastName}
          sx={{ fontWeight: isHead ? 'bold' : '', ml: 2 }}
        >
          {index + 1}. {title} {firstName} {lastName}{' '}
          {isHead && ' - (Head of team)'}
        </Typography>
      ))}
    </Box>
  );
};

export default TeamMembers;
