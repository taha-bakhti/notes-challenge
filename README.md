# notes-challenge — Private Notes

[Français](#français) | [English](#english)

## Français

### Présentation et état du projet

Projet de carnet personnel avec Next.js (App Router et Server Actions), React, TypeScript, Tailwind CSS et Supabase Auth/PostgreSQL. L'interface conserve le nom **Private Notes**.

L'authentification, les sessions et l'interface sont en place. La persistance des notes reste à réaliser : aucune migration de la table `notes` ni politique Row Level Security (RLS) n'est fournie. Les requêtes SELECT et INSERT de l'application sont des TODO. La liste reste vide et une tentative d'enregistrement affiche une erreur sans écrire de note. L'isolation des données par utilisateur est un objectif, pas une garantie déjà vérifiée.

### Installation

Prérequis : Node.js **22 ou supérieur**, npm et un projet Supabase hébergé, ou Docker pour utiliser Supabase en local. Depuis le répertoire du projet :

```bash
npm ci
cp .env.example .env.local
```

Si `.env.local` existe déjà, le modifier sans l'écraser. Renseigner les deux variables **avant** de démarrer l'application :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY
```

Utiliser l'URL du projet et sa clé **publishable** (ou la clé publique historique `anon`) provenant du même projet Supabase. Ces variables sont accessibles au navigateur : ne jamais y placer une clé secrète ou `service_role`. `.env.local` est ignoré par Git. Redémarrer le serveur après toute modification ; pour une version de production, reconstruire l'application.

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). `/` redirige vers `/notes`, qui exige une session et redirige sinon vers `/login`. La création de compte est disponible sur `/signup`.

### Configuration de Supabase Auth

Pour un projet hébergé, activer l'authentification par email/mot de passe et les inscriptions. Définir le **Site URL** sur `http://localhost:3000` et autoriser `http://localhost:3000/auth/confirm` comme URL de redirection. En déploiement, utiliser l'origine réelle du site.

Si la confirmation par email est activée, copier le contenu de [`supabase/templates/confirmation.html`](supabase/templates/confirmation.html) dans le modèle de confirmation du projet hébergé. Il dirige le lien vers `/auth/confirm` avec `token_hash` et `type=email`, comme attendu par la route de l'application. Confirmer l'adresse avant de se connecter. Le fichier `supabase/config.toml` configure uniquement l'instance locale ; il ne modifie pas le projet hébergé.

Pour utiliser Supabase en local, démarrer Docker puis exécuter la CLI déjà incluse dans les dépendances :

```bash
npx supabase start
npx supabase status
```

Reporter l'URL API locale et la clé publique affichées dans `.env.local`. La configuration utilise le port API `54321`, Studio `54323` et la boîte email locale `54324`. Les confirmations email sont désactivées par défaut en local ; les activer dans `supabase/config.toml` et redémarrer Supabase pour tester ce parcours. Le démarrage local ne fournit pas la table ni les politiques de notes manquantes.

### Vérifications locales

Après l'installation et la configuration de l'environnement :

```bash
npm run lint
npm run build
npm run typecheck
npm start
```

Le build précède le contrôle des types pour générer les types de routes Next.js sur une installation neuve. `npm start` sert le build de production ; arrêter le serveur de développement s'il occupe déjà le port 3000. En navigateur, vérifier l'inscription, la confirmation si activée, la connexion, la déconnexion et la redirection de `/notes` sans session. Les titres attendus sont `Sign in | Private Notes`, `Create account | Private Notes` et `Your notes | Private Notes`. La liste vide et l'échec d'enregistrement restent attendus à ce stade.

`npm run verify:rls` est une vérification distincte, à réserver à une base de développement jetable après création du schéma et des politiques. Elle exige deux comptes distincts pouvant se connecter et un fichier `.env.verification.local` basé sur `.env.verification.example`. Elle écrit des notes de test persistantes, tente aussi des modifications/suppressions et ne nettoie pas les données automatiquement. Elle ne prouve pas que les TODO de l'application sont implémentés.

### Configuration de développement

`next.config.ts` fixe `turbopack.root` au répertoire du projet pour éviter qu'un lockfile parent ne détermine la racine. Les versions des dépendances sont fixées dans `package-lock.json` ; utiliser `npm ci` pour les installer. Aucun déploiement automatique n'est configuré par ces instructions.

---

## English

### Overview and project status

A personal notebook project using Next.js (App Router and Server Actions), React, TypeScript, Tailwind CSS, and Supabase Auth/PostgreSQL. The interface keeps the **Private Notes** name.

Authentication, sessions, and the interface are in place. Notes persistence is unfinished: no `notes` table migration or Row Level Security (RLS) policies are provided. The application's SELECT and INSERT queries remain TODOs. The list stays empty, and saving displays an error without writing a note. Per-user data isolation is an intended outcome, not an already verified guarantee.

### Installation

Prerequisites: Node.js **22 or later**, npm, and either a hosted Supabase project or Docker for local Supabase. From the project directory:

```bash
npm ci
cp .env.example .env.local
```

If `.env.local` already exists, edit it without overwriting it. Fill in both variables **before** starting the application:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY
```

Use the project URL and **publishable** key (or legacy public `anon` key) from the same Supabase project. These variables are exposed to the browser: never use a secret or `service_role` key. `.env.local` is ignored by Git. Restart the server after changing it; rebuild for production.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `/` redirects to `/notes`, which requires a session and otherwise redirects to `/login`. Account creation is available at `/signup`.

### Supabase Auth configuration

For a hosted project, enable email/password authentication and sign-ups. Set the **Site URL** to `http://localhost:3000` and allow `http://localhost:3000/auth/confirm` as a redirect URL. For deployment, use the site's actual origin.

If email confirmation is enabled, copy [`supabase/templates/confirmation.html`](supabase/templates/confirmation.html) into the hosted project's confirmation email template. It sends the link to `/auth/confirm` with `token_hash` and `type=email`, as expected by the application's route. Confirm the address before signing in. `supabase/config.toml` configures only the local instance; it does not change a hosted project.

For local Supabase, start Docker, then use the CLI already included in the dependencies:

```bash
npx supabase start
npx supabase status
```

Copy the displayed local API URL and public key into `.env.local`. The configuration uses API port `54321`, Studio `54323`, and local email inbox `54324`. Email confirmations are disabled locally by default; enable them in `supabase/config.toml` and restart Supabase to exercise that flow. Starting locally does not provide the missing notes table or policies.

### Local verification

After installing dependencies and configuring the environment:

```bash
npm run lint
npm run build
npm run typecheck
npm start
```

Build before typechecking to generate Next.js route types on a fresh installation. `npm start` serves the production build; stop the development server if it already occupies port 3000. In the browser, check sign-up, confirmation when enabled, sign-in, sign-out, and the unauthenticated `/notes` redirect. Expected titles are `Sign in | Private Notes`, `Create account | Private Notes`, and `Your notes | Private Notes`. An empty list and failed save remain expected at this stage.

`npm run verify:rls` is a separate check for a disposable development database after the schema and policies exist. It requires two distinct accounts that can sign in and an `.env.verification.local` file based on `.env.verification.example`. It writes persistent test notes, also attempts updates/deletes, and does not automatically clean up data. It does not prove that the application's TODOs are implemented.

### Development configuration

`next.config.ts` anchors `turbopack.root` to the project directory so a parent lockfile does not determine the root. Dependency versions are locked in `package-lock.json`; install them with `npm ci`. These instructions do not configure automatic deployment.
