import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { Box, Divider, Grid, Skeleton } from '@mui/material';
import { esES } from '@mui/material/locale';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import PartyCard from './components/PartyCard';

// Function to group by date
const groupByDate = (array) => {
  return array.reduce((result, session) => {
    const date = session.date;
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(session);
    return result;
  }, {});
};

function formatDateToFrench(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  const formatted = new Intl.DateTimeFormat('fr-FR', options).format(date);
  return formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface GameSession {
  id: number;              // "101" is a string, not a number
  date: Date;            // "04/04/2025" is a string (you could use Date if parsed)
  maitre_de_jeu: string;   // "Julien"
  jeu: string;             // "Warhammer"
  type: string;            // "Cmp"
  lieu: string;            // "FSV"
  commentaire: string;     // Long text description
  number_of_players_registered: number;
  max_player: number;             // "5" is a string (could be number if parsed)
  players: string[];       // Array of player names
  locked: boolean;         // true or false
  image: string;
  image_alt: string;
}

function playerNumber(partie:GameSession) {
  if (partie.locked) {
    return(
      <LockOutlineIcon fontSize="small"/>
    )
  } else {
    return(
      <Typography gutterBottom variant="subtitle2" component="div">
        {partie.number_of_players_registered}/{partie.max_player} joueurs
      </Typography>
    )
  }
}

export default function PartiesCard(parties:GameSession[]) {
  const sessions = groupByDate(Object.values(parties));

  return (
    <Box sx={{ width: '100%'}}>
    {Object.keys(sessions).map((date) => (
    <Box key={date}>
      <Typography variant="h4" component="h1" sx={{ mb: 2, marginBottom:0 }}>
          Partie du {formatDateToFrench(Date.parse(date))}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, marginTop:0, paddingLeft:'1em' }}>
          au FSV de 14h à 22h
      </Typography>

      <Box sx={{ overflow:'auto'}}>
        <Box sx={{ display:'inline-flex',  flexWrap:'nowrap', gap:'1em'}} className={'className'}>
          {sessions[date].map((partie:GameSession) => ( 
              <PartyCard partie={partie} key={partie.id}/>
              ))}
        </Box>
      </Box>
      <Divider sx={{margin: '2em'}} orientation="horizontal" variant="middle" flexItem  />
    </Box>
    ))}
    </Box>
  );
}
