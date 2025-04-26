import React from 'react';
import { Stack, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { HomeRounded, AnalyticsRounded, PeopleRounded, AssignmentRounded, SettingsRounded, InfoRounded, HelpRounded } from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';

// Définition du type pour chaque entrée
interface MenuItem {
  text: string;
  icon: React.ReactNode;
  to: string;           // la route associée
}

const mainListItems: MenuItem[] = [
  { text: 'Home',      icon: <HomeRounded />,      to: '/' },
  { text: 'Analytics', icon: <AnalyticsRounded />, to: '/analytics' },
  { text: 'Clients',   icon: <PeopleRounded />,    to: '/clients' },
  { text: 'Tasks',     icon: <AssignmentRounded />,to: '/tasks' },
];

const secondaryListItems: MenuItem[] = [
  { text: 'Settings',  icon: <SettingsRounded />,  to: '/settings' },
  { text: 'About',     icon: <InfoRounded />,      to: '/about' },
  { text: 'Feedback',  icon: <HelpRounded />,      to: '/feedback' },
];

export default function MenuContent() {
  const { pathname } = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={NavLink}
              to={item.to}
              selected={pathname === item.to}
              sx={{
                display: 'flex',
                '&.active': {
                  backgroundColor: theme => theme.palette.action.selected,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={NavLink}
              to={item.to}
              selected={pathname === item.to}
              sx={{
                display: 'flex',
                '&.active': {
                  backgroundColor: theme => theme.palette.action.selected,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
