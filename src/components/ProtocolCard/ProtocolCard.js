import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

import ArticleIcon from '@mui/icons-material/Article';

export default function ProtocolCard({
    protocol,
    setId,
    setOpenProtcolForm
}) {
    //const { t } = useTranslation();

    return (
        <Box
            onClick={() => { setId(protocol.id); setOpenProtcolForm(true) }}
            sx={{
                p: 2,
                backgroundColor: '#ffffff',
                border: 'solid 0.5px rgba(235, 235, 235)',
                color: '#000000',
                borderRadius: 0.5,
                height: '13rem',
                width: '30%',
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
                        Protocol #{protocol.protocol_id}
                    </Typography>
                    <Typography
                        sx={{
                            height: '1.5rem',
                            fontSize: '1rem',
                        }}
                    >
                        Evaluatee: {`${protocol.evaluatee_academic_title} ${protocol.evaluatee_first_name} ${protocol.evaluatee_last_name}`}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ mt: 2, p: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F8F8F8', borderRadius: 1, }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant='button'>{protocol.evaluation_course_name}</Typography>
                    </Box>
                    <Box>
                        <Typography variant='overline'>{protocol.evaluation_course_code}</Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="body2">
                        Students: {protocol.evaluation_enrolled_students}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2">
                        Details: {protocol.evaluation_details}
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
