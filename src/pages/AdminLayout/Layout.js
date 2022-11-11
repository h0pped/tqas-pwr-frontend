import * as React from 'react';
import { useState, useContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import DescriptionIcon from '@mui/icons-material/Description';
import LanguageSwitchV2 from '../../components/LanguageSwitch/LanguageSwitchV2.js';
import Assesments from '../AdminLayout/Assesments/Assesments.js';
import ManageEvaluationGroup from '../AdminLayout/ManageEvaluationGroup/ManageEvaluationGroup.js';
import Protocols from '../AdminLayout/Protocols/Protocols.js';
import ManageUsers from '../AdminLayout/ManageUsers/ManageUsers.js';

import UserContext from '../../context/UserContext/UserContext.js';

import './layout.css';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Layout() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const { token } = useContext(UserContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [drawerSelectedItem, setDrawerSelectedItem] = useState('evaluations');

  const drawerContentList = [
    {
      title: t('drawer_item_title_classes_eval'),
      icon: <FactCheckIcon color={drawerSelectedItem === 'assesments' ? 'primary' : 'action'} />,
      link: 'assesments',
      component: <Assesments {...{ setDrawerSelectedItem, link: 'assesments' }} />,
    },
    {
      title: t('drawer_item_title_wzhz'),
      icon: <SupervisedUserCircleIcon color={drawerSelectedItem === 'wzhz-szhz' ? 'primary' : 'action'} />,
      link: 'wzhz-szhz',
      component: <ManageEvaluationGroup {...{ setDrawerSelectedItem, link: 'wzhz-szhz' }} />,
    },
    {
      title: t('drawer_item_title_protocols'),
      icon: <DescriptionIcon color={drawerSelectedItem === 'protocols' ? 'primary' : 'action'} />,
      link: 'protocols',
      component: <Protocols {...{ setDrawerSelectedItem, link: 'protocols' }} />,
    },
    {
      title: t('drawer_item_title_users'),
      icon: <GroupAddIcon color={drawerSelectedItem === 'users' ? 'primary' : 'action'} />,
      link: 'users',
      component: <ManageUsers {...{ setDrawerSelectedItem, link: 'users' }} />,
    },
  ];

  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('app_name')}
          </Typography>
          <LanguageSwitchV2 />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {drawerContentList.map((item) => (
            <Tooltip key={item.title} title={!open ? item.title : ''} placement="right">
              <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => navigate(item.link)}
                  selected={drawerSelectedItem === item.link}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, pl: 3, pr: 3, height: '100%' }}>
        <DrawerHeader />
        <Box>
          <Typography sx={{ p: 2, flex: 1, textAlign: 'end' }}>
            {t('title_logged_in_as')}
            ...
          </Typography>
        </Box>
        <Routes>
          {drawerContentList.map((item) => (
            <Route key={item.title} path={item.link} element={item.component} />
          ))}
        </Routes>
      </Box>
    </Box>
  );
}