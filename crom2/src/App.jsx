import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from './ProTip';
import Copyright from './Copyright';import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import SignIn from './sign-in/SignIn'
import Dashboard from './dashboard/Dashboard'
import PartyTab from './party-tab/PartyTab'
import MainPage from './components/MainPage';
import PartiePage from './party-tab/PartiePage';
import { getPartieNameFromId } from './party-tab/utils';

const router = createBrowserRouter([
  {
    path: "/*", //TODO: verifiquer si ca ne bloque pas l'accès à d'autre page
    element: <MainPage/>,
    handle: { breadcrumb: 'CROM' },
    children: [
      {
        index: true,
        element: <PartyTab />,
        handle: { breadcrumb: 'Parties', title: 'Calendrier Rôliste à Option Multiples' },
      },
      {
        path: "partie/:id",   // Route dynamique
        element: <PartiePage />, 
        handle: {
          breadcrumb: (match) => {
            const partieName = getPartieNameFromId(match.params.id); 
            return partieName || "Chargement...";
          }
        }
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        handle: { breadcrumb: 'Dashboard' },
      },
    ]
  },
  {
    path: "/login",
    element: <SignIn />,
    handle: { breadcrumb: 'Connexion' },
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}