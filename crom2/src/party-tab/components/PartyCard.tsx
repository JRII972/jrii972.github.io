import React, {
  FC,
  useState,
  useEffect,
  useRef,
  MouseEvent,
  SyntheticEvent,
  RefObject,
} from 'react';
import {
  Card,
  Box,
  CardActionArea,
  Skeleton,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  CardActions,
  Collapse,
} from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { GameSession } from '../PartiesCards';
import { playerNumber } from '../utils';


interface PartyCardProps {
  partie: GameSession;
}

const PartyCard: FC<PartyCardProps> = ({ partie }) => {
  // états
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  // 1) ref pour le contenu du Collapse
  // const collapseRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  // 2) scroll quand on ouvre
  // useEffect(() => {
  //   if (open && collapseRef.current) {
  //     collapseRef.current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'end',
  //       inline: 'nearest',
  //     });
  //   }
  // }, [open]);

  // 3) handlers
  const handleMouseEnter = (): void => setOpen(true);
  const handleMouseLeave = (): void => setOpen(false);

  const handleImageError = (
    e: SyntheticEvent<HTMLImageElement, Event>
  ): void => {
    setError(true);
    setLoaded(false);
    // éviter boucle si placeholder introuvable
    (e.currentTarget as HTMLImageElement).onerror = null;
    (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/216x140';
  };

  const handleImageLoad = (): void => {
    setLoaded(true);
  };

  return (
    <Card
      sx={{
        minWidth: 250,
        height: 350,
        display: 'flex',
        alignItems: 'stretch',
        maxWidth: 550,
      }}
      key={partie.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box sx={{ width: 250 }}>
        <CardActionArea>
          {!loaded && !error && (
            <Skeleton variant="rectangular" width="100%" height={140} />
          )}
          {!error && (
            <CardMedia
              component="img"
              height={140}
              image={partie.image}
              alt={partie.image_alt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sx={{ display: loaded ? 'block' : 'none' }}
            />
          )}
          {error && (
            <Box
              height={140}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <BrokenImageIcon fontSize="large" color="disabled" />
            </Box>
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {partie.jeu}
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle2">
                {partie.maitre_de_jeu}
              </Typography>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ mx: 0.5 }}
              />
              <Typography variant="subtitle2">{partie.type}</Typography>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ mx: 0.5 }}
              />
              <Typography variant="subtitle2">{partie.lieu}</Typography>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ mx: 0.5 }}
              />
              {playerNumber(partie)}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
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
          {partie.players.map((joueur: string) => (
            <Typography key={joueur} variant="overline" sx={{ lineHeight: 1.2 }}>
              {joueur}
            </Typography>
          ))}
        </CardActions>
      </Box>

      <Collapse
        in={open}
        orientation="horizontal"
        collapsedSize={0}
        sx={{
          display: open ? 'flex' : 'none',
          alignItems: 'center',
          transformOrigin: 'left center',
        }}
      >
        {/* 4) ref ici */}
        <Box
          // ref={collapseRef}
          sx={{
            width: 250,
            p: 2,
            backgroundColor: 'grey.100',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 14,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {partie.coment}
          </Typography>
        </Box>
      </Collapse>
    </Card>
  );
};

export default PartyCard;
