import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSwitchV2 from '../../components/LanguageSwitch/LanguageSwitchV2.js';

import ScheduleApproval from './ScheduleApproval/ScheduleApproval.js';
import MyAssessments from './MyAssessments/MyAssessments.js';

import departmentLogo from '../../assets/images/departmentLogo.svg';




const Layout = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const pages = [{ label: t('my_assessments'), link: 'my-assessments' }, { label: t('schedule_approval'), link: 'schedule-approval', component: <ScheduleApproval /> }];
  const settings = ['Logout'];

  const [selectedPage, setSelectedPage] = useState('my-assessments');

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageChange = (pageURL) => {
    navigate(pageURL);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img
              src={departmentLogo}
              alt="WIT Department Logo"
              width="44px"
            />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate(page.path);
                    }}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.label}
                  disabled={selectedPage === page.link}
                  variant={selectedPage === page.link ? 'contained' : 'text'}
                  onClick={() => { handleCloseNavMenu(); handlePageChange(page.link); }}
                  sx={{ my: 2, ml: 2, color: 'white', display: 'block' }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <LanguageSwitchV2 />
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, pl: 3, pr: 3, height: '100%' }}>
        <Box sx={{ mt: 3, flexGrow: 1, pl: 3, pr: 3, height: '100%' }}>
          <Routes>
            <Route exact path="/schedule-approval" element={<ScheduleApproval {...{ setSelectedPage, link: 'schedule-approval' }} />} />
            <Route exact path="/my-assessments" element={<MyAssessments {...{ setSelectedPage, link: 'my-assessments' }} />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};
export default Layout;
