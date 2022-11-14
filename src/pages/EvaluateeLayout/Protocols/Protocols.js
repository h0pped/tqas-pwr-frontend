import { useEffect, useState, useContext, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import LinearProgress from '@mui/material/LinearProgress';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import ProtocolCard from '../../../components/ProtocolCard/ProtocolCard.js';

import UserContext from '../../../context/UserContext/UserContext.js';

import config from '../../../config/index.config.js';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const fakeProtocols = {
  "protocols": [
    {
      "evaluatee_id": 1,
      "evaluatee_academic_title": "Prof. Dr. Hab.",
      "evaluatee_first_name": "Blue",
      "evaluatee_last_name": "System",
      "assessment_semester": "Winter 2022/2023",
      "evaluation_status": "Ongoing",
      "evaluation_team": [
        'Prof dr hab Jack System',
        'Prof dr hab Jack System',
        'Prof dr hab Jack System'
      ],
      "courses": [
        { "course_name": "Mathematical Analysis I", "course_code": "MA9990", "course_details": "111 C-3 cz/TP+1/2 09:15-11:00 \n111 C-3 cz/TN+1/2 09:15-11:00"},
        { "course_name": "Mathematical Analysis II","course_code": "MA10223", "course_details": "111 C-3 cz/TP+1/2 09:15-11:00 \n111 C-3 cz/TN+1/2 09:15-11:00 \n111 C-3 cz/TN+1/2 09:15-11:00 \n111 C-3 cz/TN+1/2 09:15-11:00"}
      ]
    },
    {
      "evaluatee_id": 2,
      "evaluatee_academic_title": "Dr.",
      "evaluatee_first_name": "Red",
      "evaluatee_last_name": "System",
      "assessment_semester": "Winter 2022/2023",
      "evaluation_status": "Ongoing",
      "evaluation_team": [
        'Prof dr hab Jack System',
        'Prof dr hab Jack System',
        'Prof dr hab Jack System'
      ],
      "courses": [
        { "course_name": "Physics I", "course_code": "PHY890", "course_details": "111 C-3 cz/TP+1/2 09:15-11:00 \n111 C-3 cz/TN+1/2 09:15-11:00 \n111 C-3 cz/TN+1/2 09:15-11:00"},
        { "course_name": "Physics II", "course_code": "PHY190", "course_details": "111 C-3 cz/TP+1/2 09:15-11:00 \n111 C-3 cz/TN+1/2 09:15-11:00"}
      ]
    },
  ]
}

export default function Evaluations({ setSelectedPage, link }) {
  const { t } = useTranslation();
  const { token, id } = useContext(UserContext);
  const [protocols, setProtocols] = useState([]);
  const [isProtocolFormOpen, setProtocolFormOpen] = useState(false);

  const [isProtocolsLoading, setProtocolsLoading] = useState(false);

  const notifyError = (msg) =>
    toast.error(`${t('error_dialog')} ${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const handleClose = () => {
    setProtocolFormOpen(false);
  };

  async function getProtocols() {
    setProtocolsLoading(true);
    try {
      await fetch(
        `${config.server.url}/protocols/getProtocolsByETMember?id=${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then(({ protocols }) => {
          setProtocols(protocols);
        });
    } catch (error) {
      notifyError(t('error_server'));
    } finally {
      setProtocolsLoading(false);
    }
  }

  useEffect(() => {
    setSelectedPage(link);
    getProtocols();
  }, [link, setSelectedPage]);

  return (
    <Box>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              height: '80vh',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="h5">Awaiting evaluation</Typography>
            </Box>
            <Box
              sx={{
                p: 0.7,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'scroll',
                height: '100%',
                width: '100%',
                gap: 1,
                mt: 1,
                borderRadius: 1,
                backgroundColor: '#f4f5f7',
              }}
            >
              {isProtocolsLoading && <LinearProgress />}
              {fakeProtocols.length === 0 && (
                <Typography variant="subtitle2" sx={{ color: '#848884' }}>
                  {t('no_protocols_found')}
                </Typography>
              )}
              {fakeProtocols.protocols.length > 0 &&
                fakeProtocols.protocols.map((protocol) => (
                  <ProtocolCard
                    key={protocol.id}
                    protocol={protocol}
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
              {t('protocol')}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              {t('submit')}
            </Button>
          </Toolbar>
        </AppBar>
      </Dialog>
    </Box>
  );
}
