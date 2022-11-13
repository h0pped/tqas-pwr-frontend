import { useEffect, useState, useContext, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import ProtocolCard from '../../../components/ProtocolCard/ProtocolCard.js';

import UserContext from '../../../context/UserContext/UserContext.js';

import config from '../../../config/index.config.js';

const currentlyLoggedInUserId = 24;

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Evaluations({ setSelectedPage, link }) {
    const { token } = useContext(UserContext);
    const [protocols, setProtocols] = useState([]);
    const [selectedProtocol, setSelectedProtocol] = useState(null);
    const [isProtocolFormOpen, setProtocolFormOpen] = useState(false);

    const [isProtocolsLoading, setProtocolsLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fakeProtocols = {
        "protocols": [
            {
                "protocol_id": 190022,
                "protocol_evaluation_id": 150,
                "evaluation_status": "Draft",
                "evaluation_course_code": "adsfasdf",
                "evaluation_course_name": "Object Oriented Programming",
                "evaluation_details": "test 32323323",
                "evaluation_enrolled_students": "14/14/13",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            },
            {
                "protocol_id": 190880,
                "protocol_evaluation_id": 149,
                "evaluation_status": "Draft",
                "evaluation_course_code": "das",
                "evaluation_course_name": "Data science",
                "evaluation_details": "test 123",
                "evaluation_enrolled_students": "14",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            },
            {
                "protocol_id": 190870,
                "protocol_evaluation_id": 149,
                "evaluation_status": "Draft",
                "evaluation_course_code": "das",
                "evaluation_course_name": "Data science",
                "evaluation_details": "test 123",
                "evaluation_enrolled_students": "14",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            },
            {
                "protocol_id": 190860,
                "protocol_evaluation_id": 149,
                "evaluation_status": "Draft",
                "evaluation_course_code": "das",
                "evaluation_course_name": "Data science",
                "evaluation_details": "test 123",
                "evaluation_enrolled_students": "14",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            },
            {
                "protocol_id": 190850,
                "protocol_evaluation_id": 149,
                "evaluation_status": "Draft",
                "evaluation_course_code": "das",
                "evaluation_course_name": "Data science",
                "evaluation_details": "test 123",
                "evaluation_enrolled_students": "14",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            },
            {
                "protocol_id": 190840,
                "protocol_evaluation_id": 149,
                "evaluation_status": "Draft",
                "evaluation_course_code": "das",
                "evaluation_course_name": "Data science",
                "evaluation_details": "test 123",
                "evaluation_enrolled_students": "14",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            },
            {
                "protocol_id": 190830,
                "protocol_evaluation_id": 149,
                "evaluation_status": "Draft",
                "evaluation_course_code": "das",
                "evaluation_course_name": "Data science",
                "evaluation_details": "test 123",
                "evaluation_enrolled_students": "14",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            },
            {
                "protocol_id": 190820,
                "protocol_evaluation_id": 149,
                "evaluation_status": "Draft",
                "evaluation_course_code": "das",
                "evaluation_course_name": "Data science",
                "evaluation_details": "test 123",
                "evaluation_enrolled_students": "14",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            },
            {
                "protocol_id": 190810,
                "protocol_evaluation_id": 149,
                "evaluation_status": "Draft",
                "evaluation_course_code": "das",
                "evaluation_course_name": "Data science",
                "evaluation_details": "test 123",
                "evaluation_enrolled_students": "14",
                "et_memeber_id": 24,
                "evaluatee_id": 31,
                "evaluatee_academic_title": "prof dr",
                "evaluatee_first_name": "Cherry",
                "evaluatee_last_name": "System",
                "evaluatee_email": "Cherry.System@pwr.edu.pl"
            }
        ]
    }

    async function getProtocols() {
        console.log('loadin')
        console.log(isProtocolsLoading)
        setProtocolsLoading(true);
        try {
            await fetch(
                `${config.server.url}/protocols/getProtocolsByETMember?id=${currentlyLoggedInUserId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            ).then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    setProtocols(
                        data.protocols,
                    );
                    setProtocolsLoading(false);
                });
        } catch (error) {
            console.log(error)
            setProtocolsLoading(false);
        }
    }


    useEffect(() => {
        setSelectedPage(link);
        getProtocols();
    }, [link, setSelectedPage]);

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ height: '100%' }}>
                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', height: '80vh' }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h5">Evaluation protocols</Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 0.7,
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                overflowY: 'scroll',
                                height: '100%',
                                width: '100%',
                                gap:1,
                                mt: 1,
                                borderRadius: 1,
                                backgroundColor: '#f4f5f7'
                            }}
                        >
                            {protocols.map((protocol) => (
                                <ProtocolCard
                                    key={protocol.id}
                                    protocol={protocol}
                                    setId={setSelectedProtocol}
                                    setOpenProtcolForm={setProtocolFormOpen}
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Dialog
                fullScreen
                open={isProtocolFormOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Protocol
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            Submit
                        </Button>
                    </Toolbar>
                </AppBar>
                form here
            </Dialog>
        </Box>
    )
}

