import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import partie from './data/partie';
import { DynamicThemeProvider } from "../utils/DynamicThemeProvider";

const PartiePage = () => {
  const isCampagne = partie.type === "campagne";

  return (
  <Box
    sx={{
      
    }}
  >
    <DynamicThemeProvider imageUrl={partie.image} p={2}>
      {/* Bandeau principal */}
      <Card
        sx={{
          
        position: 'relative',
        overflow: 'hidden',
          p: 4,
          background: theme => theme.palette.primary.main,
          color: theme => theme.palette.getContrastText(theme.palette.primary.main),
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${partie.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // agrandit légèrement pour éviter les bords noirs lors du flou
            transform: 'scale(1.1)',
            filter: 'blur(8px)',
          }}
        />
        <CardMedia
        sx={{ position: 'relative', }}
          component="img"
          height="350"
          image={partie.image}
          alt={partie.nom}
        />
        <CardContent
          sx={{ position: 'relative', backgroundColor: 'rgba(0, 0, 0, 0.4)', }}
        >
          <Typography variant="h4" gutterBottom>
            {partie.nom}
          </Typography>
          <Typography variant="subtitle1">
            {partie.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={partie.mj.avatar} />
            <Typography>{partie.mj.nom}</Typography>
            <Typography>- {isCampagne ? "Campagne" : "One-shot"}</Typography>
            <Button variant="contained" color="primary" sx={{ ml: "auto" }}>
              S'inscrire
            </Button>
          </Stack>
          {isCampagne && (
            <Box mt={2}>
              <Typography variant="h6">Joueurs inscrits :</Typography>
              <Stack direction="row" spacing={1} mt={1}>
                {partie.joueurs.map((joueur) => (
                  <Avatar key={joueur.id} src={joueur.avatar} alt={joueur.nom} />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Zone secondaire */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Prochaines sessions
        </Typography>
        <List>
          {partie.prochainesSessions.map((session) => (
            <React.Fragment key={session.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{new Date(session.date).getDate()}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${new Date(session.date).toLocaleDateString()} - ${session.lieu}`}
                  secondary={
                    <Stack direction="row" spacing={1} mt={1}>
                      {session.joueurs.map((joueur) => (
                        <Stack direction='row'>
                          <Avatar key={joueur.id} src={joueur.avatar} alt={joueur.nom} sx={{ width: 30, height: 30 }} />
                          <Stack direction='column' p={0.5}>
                            <Typography variant="body2">Olyvender</Typography>
                            <Typography variant="caption">Prètre de pacotille</Typography>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </DynamicThemeProvider>
  </Box>
  );
};

export default PartiePage;