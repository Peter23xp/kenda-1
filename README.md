# Kenda - Digitaliser la sécurité routière grâce à la blockchain

Ce projet est une application web développée avec Next.js qui vise à moderniser la gestion de la sécurité routière en utilisant la technologie blockchain.

## Structure de l'application

- `app/` : Contient les pages principales de l'application, organisées par rôles (usagers, agents, administration) et les API internes.
- `components/` : Composants réutilisables pour l'interface utilisateur.
- `lib/` : Fonctions utilitaires et intégrations externes (authentification, gestion des infractions, connexion à Supabase).
- `public/` : Ressources statiques comme les images et icônes.
- `styles/` ou fichiers CSS : Styles globaux et spécifiques.

Chaque rôle (usager, agent) dispose de ses propres pages pour la création de compte et l'espace utilisateur dédié. Les API dans `app/api` gèrent la logique backend, notamment la création des utilisateurs et le stockage sécurisé des documents.

## Technologies utilisées

- Next.js pour le framework frontend et backend.
- Supabase pour la gestion de la base de données, l'authentification et le stockage des documents.
- Intégration de la blockchain Cardano pour la gestion des NFTs et des paiements.

## Démarrage

Pour lancer le serveur de développement, utilisez :

```bash
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.
