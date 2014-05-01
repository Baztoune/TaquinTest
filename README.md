## TaquinTest : Jeu de recomposition d’image

### Liens
- Code https://github.com/Baztoune/TaquinTest/
- Démo http://baztoune.github.io/TaquinTest/

### Téléchargement et configuration jeu
- Télécharger https://github.com/Baztoune/TaquinTest/archive/master.zip
- Dézip
- Modifier js/conf.json (le fichier doit respecter le format JSON). Les propriétés accessibles (nombres de colonnes, lignes, largeur de case, liens, etc.) sont déjà présentes et détaillées en tête de fichier
- Ouvrir index.html

### Compte-rendu
- Temps de développement total : environ 15h. 5h pour un prototype minimal, 5h d'évolutions, refactoring, amélioration de code, 2h compatibilité IE9, 3h mise en forme, recherche
- Difficultés rencontrées : Le drag&drop est assez buggé dans IE9 et fonctionnait 1 fois sur 5. J'ai finalement trouvé une correction pour forcer le trigger de l'event.
- Incompréhensions énoncé : 
  - il est demandé d'ouvrir une vidéo youtube/page web (configurable) au double click sur une case. Faut-il que chaque case soit liée à une vidéo/page? 
  - Le drag&drop était techniquement intéressant, mais pas indispensable (une seul mouvement disponible par case) et empêche la compatibilité mobile dont on parle à la fin

### Ouverture
- Le puissance 4 partage la grille, les cases, et les tuiles (pions) avec le taquin. On peut aisément réutiliser le modèle d'objets (game/grid/cell/tile) ainsi qu'une partie du comportement de ces objets (construction HTML, déplacement pion, détection case vide).
- Le jeu étant développé en techno Web (HTML+CSS+JS), on peut imaginer le packager dans une Webview avec Phonegap et le compiler en application native Android/iOS. Cependant il faudra revoir le drag&drop qui n'est pas compatible mobile en l'état.
- Si on héberge les vidéos sur notre serveur dans les formats adaptés, on peut simplement utiliser un player Video HTML5

### Informations complémentaires
- Compatible navigateurs récents. Testé sous Firefox (Windows), Chrome (Windows), IE10 (Windows), IE9 (VM Windows)
- Non compatible mobile à cause du drag&drop. Le "drag" est nécessaire au navigateur mobile pour détecter un scroll
- Développé avec utilisation minimale de code externe ; uniquement quelques polyfills pour combler les lacunes d'IE9
- Lecteur Youtube forcé en HTML5 pour éviter flash
