# Todo Demo Web - Vue.js

Interface utilisateur moderne pour une application Todo List avec Vue 3, Vite et Pinia.

## Fonctionnalités

- ✨ Interface moderne et animée
- 🎨 Design responsive avec dégradés
- 🔍 Recherche en temps réel
- 🎯 Filtres multiples (priorité, catégorie, statut)
- ⭐ Système de favoris
- 📊 Statistiques en temps réel
- 🎭 Animations fluides et transitions
- 📱 Optimisé mobile
- 🌈 Badges colorés pour priorités/catégories
- ✏️ Édition inline avec modal
- 🗑️ Suppression avec confirmation

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

L'application démarre sur `http://localhost:5173`

## Configuration

L'API backend doit être lancée sur `http://localhost:8000`

Le proxy Vite redirige automatiquement les requêtes `/api` vers le backend.

## Structure

```
src/
├── api/           # Appels API
├── components/    # Composants Vue
├── stores/        # State management (Pinia)
├── App.vue        # Composant principal
├── main.js        # Point d'entrée
└── style.css      # Styles globaux & animations
```

## Technologies

- Vue 3 (Composition API)
- Vite
- Pinia (state management)
- Axios (HTTP client)
- CSS moderne avec animations
