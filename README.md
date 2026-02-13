# Saint Guettotin - Site de Saint-Valentin Interactif 💕

Un site web interactif et personnalisable pour créer une expérience unique de Saint-Valentin.

## 🎯 Fonctionnalités

- 📸 Galerie de photos avec effets et stickers
- ❓ Quiz personnalisé avec feedback multimédia
- 🎵 Intégration Spotify
- 💝 Proposition de Saint-Valentin interactive
- 🎉 Animation de célébration
- 📅 Programmes de rendez-vous au choix

## ⚙️ Mode Édition

### Activer le mode édition
1. Cliquez sur le bouton ⚙️ en bas à droite de la page
2. Le panneau d'édition apparaît à droite
3. Un indicateur "Mode Édition Actif" s'affiche en haut

### Modifier le contenu

**Paramètres Généraux:**
- Utilisez la section "📝 Paramètres Généraux" en haut du panneau
- Modifiez :
  - **Titre principal** : Le titre de votre site
  - **Sous-titre** : Le sous-titre qui apparaît
  - **Nom du destinataire** : Le nom de la personne à qui c'est destiné
  - **Nom de l'expéditeur** : Votre nom
  - **Score minimum** : Score requis pour réussir le quiz
- Cliquez sur "Mettre à jour" pour appliquer

**Photos:**
- Double-cliquez sur une photo pour l'éditer
- Changez l'URL, ajoutez des effets ou des stickers
- Glissez-déposez les photos pour les repositionner
- Cliquez sur le ✕ rouge pour supprimer

**Questions:**
- Double-cliquez sur une question pour l'éditer
- Modifiez le texte, les réponses et la bonne réponse
- Ajoutez des URLs pour les feedback (images/GIFs et sons)
  - **Feedback Bonne Réponse**: GIF et son de succès
  - **Feedback Mauvaise Réponse**: GIF et son d'échec

**Programmes:**
- Double-cliquez sur un programme pour l'éditer
- Modifiez le titre, la description, l'emoji et les activités

**Musique Spotify:**
- Collez l'URL d'une chanson ou playlist Spotify
- Cochez "Activer" pour afficher le lecteur
- Formats acceptés:
  - `https://open.spotify.com/track/...`
  - `https://open.spotify.com/playlist/...`
  - `https://open.spotify.com/intl-fr/track/...` (géré automatiquement)

**GIFs de Célébration:**
- Ajoutez des URLs de GIFs qui s'afficheront après le "OUI"
- Utilisez la section "URL GIF célébration"

**Édition de texte (Triple-clic):**
- Triple-cliquez sur n'importe quel texte pour le modifier rapidement
- Les modifications de noms se synchronisent automatiquement avec appData

## 💾 Sauvegarder vos modifications

**IMPORTANT:** Les modifications faites dans la page web sont temporaires et sauvegardées uniquement dans le localStorage de votre navigateur.

### Workflow pour sauvegarder de façon permanente:

1. **Modifiez** le contenu comme souhaité dans le mode édition
2. **Exportez** en cliquant sur "📥 Exporter pour GitHub Pages"
3. **Téléchargez** le fichier `data.json` généré
4. **Remplacez** le fichier `data.json` dans votre dépôt GitHub
5. **Committez et poussez** les changements vers GitHub
6. **Attendez** le déploiement automatique (quelques minutes)

```bash
# Exemple de commandes Git
git add data.json
git commit -m "Mise à jour du contenu"
git push
```

### Pourquoi ce workflow?

Ce site est un site **statique** hébergé sur GitHub Pages. Il n'a pas de backend/serveur pour sauvegarder automatiquement les données. Le fichier `data.json` est la source de vérité qui doit être mis à jour dans le dépôt pour que les changements soient permanents.

## 📁 Structure du projet

```
├── index.html      # Structure HTML de la page
├── styles.css      # Styles et animations
├── app.js          # Logique JavaScript et interactions
├── data.json       # Données du site (IMPORTANT: source de vérité)
└── README.md       # Ce fichier
```

## 🎨 Personnalisation

### Modifier les textes principaux
Éditez directement dans `data.json`:
```json
{
  "title": "Eh oh, c'est pour toi...",
  "subtitle": "Oui toi, regarde en bas",
  "fromName": "Ton J (le beau gosse)",
  "toName": "RoroLasticot",
  "passingScore": 4
}
```

### Ajouter des photos
```json
{
  "id": 1234567890,
  "url": "https://example.com/photo.jpg",
  "x": 10,
  "y": 100,
  "rotation": 5,
  "effect": "pulse",
  "sticker": "heart-red"
}
```

### Ajouter des questions
```json
{
  "id": 1,
  "question": "Votre question ?",
  "answers": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
  "correctAnswer": 0,
  "correctImage": "https://media.giphy.com/media/success.gif",
  "correctSound": "https://example.com/correct.mp3",
  "incorrectImage": "https://media.giphy.com/media/fail.gif",
  "incorrectSound": "https://example.com/wrong.mp3"
}
```

## 🚀 Déploiement

Le site se déploie automatiquement sur GitHub Pages à chaque push sur la branche principale.

URL du site: `https://[votre-username].github.io/SaintGuettotin/`

## 🛠️ Développement local

```bash
# Serveur HTTP simple avec Python
python3 -m http.server 8080

# Ou avec Node.js
npx http-server -p 8080

# Puis ouvrir http://localhost:8080 dans votre navigateur
```

## 📝 Notes importantes

- ⚠️ Les modifications en mode édition sont **temporaires** jusqu'à l'export
- 💾 Toujours exporter et committer le `data.json` pour sauvegarder
- 🔄 Le localStorage est spécifique à chaque navigateur
- 🎵 Les URLs Spotify avec `intl-XX/` sont automatiquement converties
- 📱 Le site est responsive et fonctionne sur mobile

## 🐛 Dépannage

**Les modifications ne s'affichent pas en ligne:**
- Avez-vous exporté et commité le fichier `data.json` ?
- Le déploiement GitHub Pages a-t-il réussi ?
- Essayez de vider le cache du navigateur (Ctrl+F5)

**Spotify ne fonctionne pas:**
- Vérifiez que l'URL est correcte
- Les URLs avec `intl-fr/` sont supportées
- Essayez de cocher/décocher "Activer"

**Les images ne s'affichent pas:**
- Vérifiez que les URLs sont accessibles publiquement
- Certains sites bloquent l'embedding (utilisez imgur, giphy, etc.)

## 💡 Conseils

- Utilisez [Giphy](https://giphy.com) pour trouver des GIFs sympas
- Utilisez [MyInstants](https://www.myinstants.com) pour des effets sonores
- Gardez une copie de votre `data.json` en backup
- Testez toujours en local avant de pusher

## 📄 Licence

Projet personnel - Utilisation libre
