# Kenda - Système de Gestion des Contraventions sur Cardano 🚦

Kenda est une application décentralisée (dApp) permettant la gestion transparente et immuable des contraventions routières en utilisant la blockchain Cardano.

## 🏗️ Architecture du Projet

Le projet est construit avec **Next.js 14** (App Router) et utilise une architecture hybride :
- **Frontend** : React, TailwindCSS, MeshSDK (pour l'interaction Wallet).
- **Backend** : Next.js API Routes, Supabase (Base de données & Auth).
- **Blockchain** : Cardano (Preprod Testnet) pour l'enregistrement des preuves et les paiements.

## 📂 Arborescence Détaillée

Voici un guide pour naviguer dans le code source :

### `/app` (Le Cœur de l'Application - Next.js App Router)
C'est ici que se trouvent toutes les pages et les routes API.
- **`/agents`** : Espace dédié aux agents (création de contraventions).
  - `/espace` : Dashboard de l'agent.
  - `/creation` : Formulaire de création d'une contravention.
- **`/usagers`** : Espace dédié aux citoyens.
  - `/espace` : Dashboard de l'usager.
  - `/mes-contraventions` : Historique et paiement des amendes.
- **`/api`** : Le Backend (Serveur).
  - `/auth` : Gestion de l'authentification (connexion, résolution d'identifiants).
  - `/contraventions` :
    - `/save` : Enregistrement d'une contravention (Hashage + Stockage Supabase).
    - `/pay` : Validation sécurisée du paiement Cardano (Vérification Blockfrost).
  - `/usagers` : Récupération des données spécifiques aux usagers.

### `/components` (Les Briques UI)
- **`/agents`** : Composants spécifiques aux agents (Menu profil, formulaires...).
- **`/usagers`** : Composants spécifiques aux usagers.
- **`/contraventions`** :
  - `ContraventionCard.tsx` : Carte affichant une amende.
  - `MetadataModal.tsx` : Modale de détails + **Logique de Paiement MeshSDK**.
  - `ContraventionsList.tsx` : Grille responsive des contraventions.
- **`/ui`** : Composants génériques réutilisables (Boutons, Inputs, Cards...).

### `/lib` (Les Outils & Utilitaires)
C'est la boîte à outils du projet.
- `auth.ts` : Fonctions d'aide pour l'authentification.
- `blockchain.ts` : Logique de hachage et préparation des métadonnées Cardano.
- `supabaseAdmin.ts` : Client Supabase avec droits administrateur - **Backend uniquement**.
- `supabaseBrowserClient.ts` : Client Supabase pour le frontend (Droits limités).
- `utils.ts` : Fonctions utilitaires (ex: `convertToLovelace` pour le calcul des prix ADA/USD).

## 🚀 Démarrage

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`.

## 💳 Paiement Cardano

Le flux de paiement est sécurisé :
1. L'utilisateur connecte son wallet (Nami, Eternal...).
2. Il signe une transaction vers l'adresse du Trésor.
3. Le Frontend envoie le Hash de la transaction à l'API `/api/contraventions/pay`.
4. L'API vérifie sur la blockchain (via Blockfrost) que l'argent est bien arrivé.
5. Si tout est OK, l'API met à jour le statut dans Supabase.
