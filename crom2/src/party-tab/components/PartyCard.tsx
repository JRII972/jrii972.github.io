import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { Box, Collapse, Divider, Grid, Skeleton } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import LockOutlineIcon from '@mui/icons-material/LockOutline';

import { GameSession } from '../PartiesCards';

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

export default function PartyCard({partie}) {
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  console.log(partie.id)
  console.log(partie.players)
  return (
    <Card sx={{ minWidth: 250, height:350, display: 'flex', alignItems: 'stretch', maxWidth: 550  }} key={partie.id}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)} >
      <Box sx={{ width: 250}}>
      <CardActionArea >
        {!loaded && !error && (
          <Skeleton variant="rectangular" width="100%" height={140} />
        )}
        {!error && (
          <CardMedia
            component="img"
            height="140"
            image={partie.image}
            alt={partie.image_alt}
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              setError(true);
              setLoaded(false);
              // empêche la boucle si defaultImg est introuvable
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/216x140';
            }}
            // on masque l’image tant qu’elle n’est pas chargée
            sx={{ display: loaded ? 'block' : 'none' }}
          />
        )}
        {error && (
          // <Skeleton variant="rectangular" width="100%" height={140} />
         <Box height={140} display="flex" alignItems="center" justifyContent="center">
              <BrokenImageIcon fontSize="large" color="disabled" />
          </Box> 
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {partie.jeu}
          </Typography>
          <Box sx={{ display: 'inline-flex', flexDirection: 'row', aligntems: 'center'}}>
            <Typography gutterBottom variant="subtitle2" component="div">
              {partie.maitre_de_jeu}
            </Typography>
            <Divider orientation='vertical' variant='middle' flexItem sx={{ marginInline: '0.5em'}}/>
            <Typography gutterBottom variant="subtitle2" component="div">
              {partie.type}  
            </Typography>
            <Divider orientation='vertical' variant='middle' flexItem sx={{ marginInline: '0.5em'}}/>
            <Typography gutterBottom variant="subtitle2" component="div">
              {partie.lieu}  
            </Typography>
            <Divider orientation='vertical' variant='middle' flexItem sx={{ marginInline: '0.5em'}}/>
            {playerNumber(partie)}
          </Box>
          <Typography variant="body2" sx={{ 
            color: 'text.secondary', 
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis'}} 
            component={'p'}>
              {partie.short_coment}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          justifyContent: 'center',
        }}
      >
        {partie.players.map((joueur) => (
          <Typography 
            key={joueur} 
            variant="overline"
            sx={{
              lineHeight: '1.2'
            }}>
            {joueur}
          </Typography>
        ))}
      </CardActions>
      {/* <CardActions>
        <Button size='small' onClick={() => setOpen(o => !o)}>
          {open ? 'Fermer' : 'Ouvrir'}
        </Button>
      </CardActions> */}
      </Box>
      <Collapse
        in={open}
        orientation="horizontal"
        collapsedSize={0}            // largeur quand c'est fermé
        sx={{
          // pour que le contenu prenne toute la hauteur du parent
          display: open ? 'flex' : 'none',
          alignItems: 'center',
          // point d’origine de l’animation sur la gauche
          transformOrigin: 'left center',
        }}
      >
        <Box
          sx={{
            width: 250,              // largeur quand c'est ouvert
            p: 2,
            backgroundColor: 'grey.100',
          }}
        >
          {/* <Typography>{partie.jeu}</Typography> */}
          <Typography variant="body2" sx={{ 
            color: 'text.secondary', 
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis'}} 
            component={'p'}>
              {partie.coment} 
          </Typography>
        </Box>
      </Collapse>
    </Card>
  );
}
