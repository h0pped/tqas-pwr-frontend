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
import { useTranslation } from 'react-i18next';

import ProtocolCard from '../../../components/ProtocolCard/ProtocolCard.js';

import UserContext from '../../../context/UserContext/UserContext.js';

import config from '../../../config/index.config.js';

const currentlyLoggedInUserId = 24;

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function Evaluations({ setSelectedPage, link }) {
  const { t } = useTranslation();
  const { token } = useContext(UserContext);
  const [protocols, setProtocols] = useState([]);
  const [isProtocolFormOpen, setProtocolFormOpen] = useState(false);

  const [isProtocolsLoading, setProtocolsLoading] = useState(false);

  const handleClose = () => {
    setProtocolFormOpen(false);
  };

  async function getProtocols() {
    setProtocolsLoading(true);
    try {
      await fetch(
        `${config.server.url}/protocols/getProtocolsByETMember?id=${currentlyLoggedInUserId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setProtocols(data.protocols);
          setProtocolsLoading(false);
        });
    } catch (error) {
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
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              height: '80vh',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="h5">{t('evaluation_protocols')}</Typography>
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
                gap: 1,
                mt: 1,
                borderRadius: 1,
                backgroundColor: '#f4f5f7',
              }}
            >
              {isProtocolsLoading && <LinearProgress />}
              {protocols.length === 0 && (
                <Typography variant="subtitle2" sx={{ color: '#848884' }}>
                  {t('no_protocols_found')}
                </Typography>
              )}
              {protocols.length > 0 &&
                protocols.map((protocol) => (
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
