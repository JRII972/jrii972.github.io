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
    <DynamicThemeProvider imageUrl={partie.image}>
    <Box
      sx={{
        p: 4,
        background: theme => theme.palette.primary.main,
        color: theme => theme.palette.getContrastText(theme.palette.primary.main),
        textAlign: 'center',
      }}
    >
      {/* wrapper relatif */}
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          overflow: 'visible',
  
          // couche floutée
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${partie.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px)',
            // masque radial pour le fondu vers la transparence
            maskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)',
            zIndex: 2,
          },
  
          // image nette au-dessus
          '& img': {
            display: 'block',
            width: '100%',
            height: 'auto',
            position: 'relative',
            zIndex: 1,
          },
        }}
      >
        <img src={partie.image} alt="Visuel" />
      </Box>
  
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Partie thématique
      </Typography>
      <Button variant="contained" color="secondary">
        Action liée
      </Button>
    </Box>
  </DynamicThemeProvider>
  );

  // return (
  //   <Box p={2}>
  //     {/* Bandeau principal */}
  //     <Card>
  //       <CardMedia
  //         component="img"
  //         height="300"
  //         image={partie.image}
  //         alt={partie.nom}
  //       />
  //       <CardContent>
  //         <Typography variant="h4" gutterBottom>
  //           {partie.nom}
  //         </Typography>
  //         <Typography variant="subtitle1" color="textSecondary">
  //           {partie.description}
  //         </Typography>
  //         <Divider sx={{ my: 2 }} />
  //         <Stack direction="row" spacing={2} alignItems="center">
  //           <Avatar src={partie.mj.avatar} />
  //           <Typography>{partie.mj.nom}</Typography>
  //           <Typography color="textSecondary">- {isCampagne ? "Campagne" : "One-shot"}</Typography>
  //           <Button variant="contained" color="primary" sx={{ ml: "auto" }}>
  //             S'inscrire
  //           </Button>
  //         </Stack>
  //         {isCampagne && (
  //           <Box mt={2}>
  //             <Typography variant="h6">Joueurs inscrits :</Typography>
  //             <Stack direction="row" spacing={1} mt={1}>
  //               {partie.joueurs.map((joueur) => (
  //                 <Avatar key={joueur.id} src={joueur.avatar} alt={joueur.nom} />
  //               ))}
  //             </Stack>
  //           </Box>
  //         )}
  //       </CardContent>
  //     </Card>

  //     {/* Zone secondaire */}
  //     <Box mt={4}>
  //       <Typography variant="h5" gutterBottom>
  //         Prochaines sessions
  //       </Typography>
  //       <List>
  //         {partie.prochainesSessions.map((session) => (
  //           <React.Fragment key={session.id}>
  //             <ListItem alignItems="flex-start">
  //               <ListItemAvatar>
  //                 <Avatar>{new Date(session.date).getDate()}</Avatar>
  //               </ListItemAvatar>
  //               <ListItemText
  //                 primary={`${new Date(session.date).toLocaleDateString()} - ${session.lieu}`}
  //                 secondary={
  //                   <Stack direction="row" spacing={1} mt={1}>
  //                     {session.joueurs.map((joueur) => (
  //                       <Avatar key={joueur.id} src={joueur.avatar} alt={joueur.nom} sx={{ width: 30, height: 30 }} />
  //                     ))}
  //                   </Stack>
  //                 }
  //               />
  //             </ListItem>
  //             <Divider component="li" />
  //           </React.Fragment>
  //         ))}
  //       </List>
  //     </Box>
  //   </Box>
  // );
};

export default PartiePage;