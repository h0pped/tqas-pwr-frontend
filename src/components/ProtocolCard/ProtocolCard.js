import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

import ArticleIcon from '@mui/icons-material/Article';
import { Divider } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function ProtocolCard({
    protocol,
    setOpenProtcolForm
}) {
    const { t } = useTranslation();

    return (
        <Box
            onClick={() => { setOpenProtcolForm(true) }}
            sx={{
                p: 2,
                backgroundColor: '#ffffff',
                border: 'solid 0.5px rgba(235, 235, 235)',
                color: '#000000',
                borderRadius: 0.5,
                minHeight: '13rem',
                maxHeight: '16rem',
                minWidth: '20rem',
                flex: 1,
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
                    display:
                        'flex',
                    flexDirection: 'row',
                    gap: 1.5,
                }}
            >
                <Box sx={{
                    p: 0.5,
                    borderRadius: 2,
                    backgroundColor: '#fdf0ef',
                    width: '3rem',
                    height: '3rem',
                }}
                >
                    <ArticleIcon
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
                        {t('protocol')} #{protocol.protocol_id}
                    </Typography>
                    <Typography
                        sx={{
                            height: '1.5rem',
                            fontSize: '1rem',
                        }}
                    >
                        {t('evaluatee')}: {`${protocol.evaluatee_academic_title} ${protocol.evaluatee_first_name} ${protocol.evaluatee_last_name}`}
                    </Typography>
                </Box>
            </Box>
            <Chip sx={{ mt: 2}} icon={<CalendarMonthIcon />} label={protocol.semester_of_assessment} variant="outlined" />
            <Box sx={{ mt: 2, p: 1, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8F8F8', borderRadius: 1, }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant='button'>{protocol.evaluation_course_name}</Typography>
                    </Box>
                    <Box>
                        <Typography variant='overline'>{protocol.evaluation_course_code}</Typography>
                    </Box>
                </Box>
                <Divider />
                <Box sx={{mt: 2}}>
                    <Typography variant="body2">
                        {t('enrolled_students')}: {protocol.evaluation_enrolled_students}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2">
                        {t('details')}: {protocol.evaluation_details}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Chip
                    sx={{ color: '#000000' }}
                    size="small"
                    label={protocol.evaluation_status}
                />
            </Box>
        </Box>
    );
}
