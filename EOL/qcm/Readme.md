# QCM


## Description

QCM de maximum 4 question, avec gestion de score

Le design est modifiable, il serait imaginable de changer pour quelque chose de moins neutre (ex : Qui veux gagner des millions)
Il serais possible d'utiliser les vidéo filmer comme support pour les questions (un peu comme au Code, pour le permis)
Ou entre des animations des autres mini jeu

## DEV

Les questions sont stocker dans un ficher json (./src/data.json), on peux donner la question, une image associé, information sur la réponse, les réponses et les points associcé à celles-ci.

Les points sont addition (ou soustrait), puis sauvegarder dans le navigateur
Les questions déjà poser sont aussi sauvegarder

Le fichier data.json est récuperer via call ajax, ce qui fait que les règle CORS empèche de l'important sans live server

Utiliser visual studio code avec l'extention live server (ou la prévisualisation intégrée dans les dernière version) pour voir le résultat actuelle


## TODO
Raccourcir le code
Faire un menu dé début de jeu
Btn de reset score

Sauvegarder score sur serveur (car pour certain les postes sont configurer pour wipe les donner de nav apres fermeture)

Revoire le systeme de score
Revoir la structure du ficher *data.json*