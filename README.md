# Private Notes — Next.js & Supabase

[Français](#français) | [English](#english)

---

## Français

### Présentation

Une application de notes privées basée sur Next.js et Supabase, avec une gestion sécurisée des données au niveau de PostgreSQL grâce au Row Level Security (RLS).

L'objectif est de permettre à chaque utilisateur de créer et consulter ses propres notes, sans pouvoir accéder à celles des autres utilisateurs.

### Stack technique

- Next.js — App Router & Server Actions
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- PostgreSQL

### Installation

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Renseigner l'URL du projet Supabase et la clé publique dans le fichier `.env.local` avant de démarrer l'application.

L'application est accessible sur `http://localhost:3000`.

### État du projet

- [x] Initialisation du projet Next.js
- [x] Configuration Supabase
- [x] Authentification et gestion des sessions
- [x] Interface utilisateur
- [ ] Migration de la table notes
- [ ] Policies RLS
- [ ] Création et récupération des notes
- [ ] Vérification de l'isolation des données

### Approche de développement

Les fonctionnalités sont développées sur des branches dédiées, intégrées via des pull requests et déployées automatiquement avec Vercel.

---

## English

### Overview

A private notes application built with Next.js and Supabase, enforcing data security at the PostgreSQL level through Row Level Security (RLS).

The objective is to allow each user to create and retrieve their own notes without accessing notes belonging to other users.

### Tech stack

- Next.js — App Router & Server Actions
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- PostgreSQL

### Getting started

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Configure the Supabase project URL and publishable key in `.env.local` before starting the application.

The application is available at `http://localhost:3000`.

### Project status

- [x] Next.js project initialization
- [x] Supabase configuration
- [x] Authentication and session management
- [x] User interface
- [ ] Notes table migration
- [ ] RLS policies
- [ ] Note creation and retrieval
- [ ] Data isolation verification

### Development workflow

Features are developed on dedicated branches, integrated through pull requests and automatically deployed using Vercel.