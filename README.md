# 💕 Site Saint-Valentin pour RoroLasticot

Un site web romantique et interactif pour inviter votre copine à la Saint-Valentin.

## 🌟 Fonctionnalités

- **📸 Collage Photo** : Affichez vos photos avec effets et stickers
- **❓ Questionnaire QCM** : Testez ses connaissances sur votre couple
- **💕 Demande Valentine** : Le bouton "Non" s'échappe ! (Impossible de cliquer dessus)
- **🎉 Célébration** : Confettis et GIFs quand elle dit "Oui"
- **📅 Programmes** : Proposez plusieurs options pour la Saint-Valentin
- **✏️ Mode Édition** : Triple-clic pour activer le mode édition

## 🚀 Déploiement sur GitHub Pages

### Étape 1 : Créer le repository
1. Allez sur [GitHub](https://github.com) et connectez-vous
2. Cliquez sur "New Repository"
3. Nommez-le `username.github.io` (remplacez username par votre nom d'utilisateur) OU un autre nom
4. Cliquez sur "Create repository"

### Étape 2 : Uploader les fichiers
1. Dans votre repository, cliquez sur "Add file" → "Upload files"
2. Glissez-déposez ces 4 fichiers :
   - `index.html`
   - `styles.css`
   - `app.js`
   - `data.json`
3. Cliquez sur "Commit changes"

### Étape 3 : Activer GitHub Pages
1. Allez dans "Settings" du repository
2. Dans le menu de gauche, cliquez sur "Pages"
3. Sous "Source", sélectionnez "main" (ou "master")
4. Cliquez sur "Save"

### Étape 4 : Accéder à votre site
- Si le repo s'appelle `username.github.io` → `https://username.github.io`
- Sinon → `https://username.github.io/nom-du-repo`

## ✏️ Comment Modifier le Site

### Option 1 : Via l'interface d'édition
1. Ouvrez votre site
2. Faites un **triple-clic** n'importe où sur la page
3. Le panneau d'édition apparaît en bas à droite
4. Modifiez ce que vous voulez
5. Cliquez sur "Exporter pour GitHub Pages"
6. Téléchargez le fichier `data.json`
7. Uploadez-le sur GitHub pour remplacer l'ancien

### Option 2 : Modifier directement le fichier JSON
Éditez le fichier `data.json` sur GitHub :

```json
{
  "fromName": "Votre Prénom",
  "toName": "Son Prénom",
  "photos": [
    {
      "id": 1,
      "url": "URL_DE_VOTRE_PHOTO",
      "x": 10,
      "y": 100,
      "rotation": -5,
      "effect": "pulse",
      "sticker": "heart-red"
    }
  ],
  "questions": [
    {
      "id": 1,
      "question": "Votre question ?",
      "answers": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
      "correctAnswer": 0
    }
  ],
  "programs": [
    {
      "id": 1,
      "title": "Titre du programme",
      "description": "Description",
      "activities": ["Activité 1", "Activité 2"],
      "emoji": "🌹"
    }
  ]
}
```

## 🎨 Effets et Stickers Disponibles

### Effets de Photo
- `none` : Aucun effet
- `pulse` : Cœur qui bat
- `float` : Légère lévitation
- `shine` : Brillance
- `glow` : Halo lumineux

### Stickers
- `none` : Aucun
- `heart-red` : ❤️
- `heart-pink` : 💕
- `star` : ⭐
- `flower` : 🌸

## 📸 Ajouter vos Photos

### Option 1 : URLs en ligne
Utilisez des services comme :
- [Imgur](https://imgur.com) (gratuit, pas de compte requis)
- [Google Photos](https://photos.google.com) (partager → obtenir le lien)
- [Dropbox](https://dropbox.com) (mettre en public)

### Option 2 : Base64 (pour les petites images)
Convertissez vos images en base64 et intégrez-les directement.

## 🔧 Structure des Fichiers

```
saint-valentin/
├── index.html      # Page principale
├── styles.css      # Styles et animations
├── app.js          # Logique JavaScript
├── data.json       # Données modifiables
└── README.md       # Ce fichier
```

## 💝 Créé avec amour pour RoroLasticot

**Par : Le J** ❤️

---

*Bon courage pour la Saint-Valentin ! 🌹*
