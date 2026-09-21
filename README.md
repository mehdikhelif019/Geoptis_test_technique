# Geoptis - Test Technique : Gestion des Emplacements de Restaurants

Application full-stack permettant d'ajouter, visualiser, rechercher, filtrer et modifier des restaurants avec leurs coordonnées géographiques, développée pour le test technique Geoptis.

## Stack technique

- **Frontend** : Vue.js 3 (Composition API) + TypeScript + Vite
- **Backend** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL (hébergée sur Supabase)
- **Bonus** : Leaflet (carte), formule de Haversine (calcul de distance)

## Installation et lancement

### Prérequis
- Node.js v16+ (testé avec v20)
- Docker et Docker Compose (pour l'option A, recommandée)
- Un compte Supabase (optionnel, uniquement pour l'option B)

## Cloner le projet

```bash
git clone https://github.com/mehdikhelif019/Geoptis_test_technique.git
cd Geoptis_test_technique
```

## Base de données

### Option A : Docker (recommandé pour évaluer rapidement le projet)

Aucune création de compte externe nécessaire. Depuis la racine du projet :

```bash
docker compose up -d
```

Cela lance un PostgreSQL local (port 5433) avec le schéma et les données d'exemple déjà créés automatiquement.

### Option B : Supabase (ou toute instance PostgreSQL externe)

1. Créer un projet Supabase.
2. Exécuter le script `db/init.sql` dans l'éditeur SQL Supabase.

## Backend

```bash
cd backend
npm install
```

Configurer `.env` selon l'option choisie ci-dessus :

- **Option A (Docker)** : `cp .env.docker .env`
- **Option B (Supabase)** : `cp .env.example .env`, puis renseigner `DATABASE_URL` avec votre connection string Supabase (`DATABASE_SSL=true`)

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`. Vérifier avec `GET /api/health`.

> **Note** : au tout premier démarrage, PostgreSQL peut prendre quelques secondes pour s'initialiser (création du schéma). Si le backend affiche une erreur de connexion `ECONNREFUSED` immédiatement après `docker compose up -d`, patientez 5-10 secondes puis relancez `npm run dev`.

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_BASE_URL est déjà pré-rempli pour du développement local
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Fonctionnalités implémentées

### Requises
- [x] Formulaire d'ajout avec validation client (nom, adresse, coordonnées, cuisine, téléphone)
- [x] Liste des restaurants en tableau avec indicateurs visuels par type de cuisine
- [x] Recherche par nom/adresse (avec debounce de 400ms)
- [x] Filtrage par type de cuisine
- [x] Validation géographique (latitude -90/90, longitude -180/180) côté client, serveur et base de données (triple couche)
- [x] API REST complète (POST, GET, GET /search, GET /filter)

### Bonus
- [x] Carte interactive Leaflet avec marqueurs et popups
- [x] Calcul de distance entre deux restaurants (formule de Haversine)
- [x] Édition des restaurants existants (PUT /api/restaurants/:id)

## Choix techniques et raisonnement

### Architecture générale
Le frontend est organisé en trois couches distinctes : les **composants** (affichage pur, aucune logique métier), les **composables** (état réactif partagé + logique, ex: `useRestaurants`), et les **services** (appels HTTP isolés). Cette séparation permet de tester/modifier chaque couche indépendamment — par exemple, changer l'URL de l'API ne touche qu'un seul fichier.

### Validation en triple couche
La validation des coordonnées géographiques est dupliquée volontairement à trois niveaux :
1. **Client** (retour instantané, pas d'aller-retour réseau)
2. **Serveur** (sécurité réelle, ne jamais faire confiance au frontend)
3. **Base de données** (contraintes `CHECK`, dernier filet de sécurité même en cas de bug applicatif)

### Gestion de la précision géographique
PostgreSQL retourne les colonnes `DECIMAL` sous forme de `string` via le driver `pg`, pas de `number` (pour éviter les pertes de précision liées aux flottants). Ce comportement n'est pas visible dans le typage TypeScript de l'API à la compilation — il a été découvert à l'exécution (voir section "Difficultés rencontrées"). La normalisation est faite une seule fois, à la sortie du service HTTP (`normalizeRestaurant`), pour que tout le reste de l'application puisse faire confiance au typage `number` déclaré.

L'affichage tronque à 4 décimales (`toFixed(4)`, précision d'environ 11m) pour la lisibilité, tandis que le stockage garde les 8 décimales du schéma fourni — distinction volontaire entre précision de stockage et précision d'affichage.

### Recherche avec debounce
La recherche déclenche une requête serveur 400ms après la dernière frappe (pas à chaque caractère), pour éviter de surcharger le backend inutilement sur une saisie rapide.

### Calcul de distance
La formule de Haversine a été choisie plutôt qu'une distance euclidienne simple, car la Terre est courbe : une distance latitude/longitude ne peut pas être calculée avec Pythagore sans erreur significative, notamment aux latitudes élevées. Le calcul se fait entièrement côté client (pas de charge serveur) à partir des données déjà en mémoire.

### Sécurité RLS Supabase
Row Level Security a été désactivé sur la table : l'architecture fait passer toutes les requêtes par le backend Express (qui utilise les identifiants complets de la base), pas par un accès direct depuis le frontend avec une clé publique. RLS aurait du sens dans une architecture où le frontend interroge directement Supabase.

## Difficultés rencontrées et résolues

Documenter honnêtement le process, comme demandé dans le sujet :

1. **CodeSandbox (crédits épuisés)** : développement initialement prévu sur CodeSandbox Devbox, interrompu par l'épuisement des crédits du plan gratuit. Bascule vers un environnement de développement local (Node.js + VS Code) sans changement d'architecture.
2. **Incompatibilité `ts-node-dev` / TypeScript** : `npm install` a résolu TypeScript en version 7.x (trop récente), incompatible avec `ts-node-dev`. Résolu en fixant `typescript@5.6.3`.
3. **Connexion SSL à Supabase** : la connexion directe à Supabase (IPv6) échouait avec une erreur SSL en environnement Windows local. Résolu en utilisant le connection pooler Supabase (IPv4, port 6543).
4. **`latitude`/`longitude` retournées en `string`** : bug découvert lors de l'affichage (`TypeError: value.toFixed is not a function`), dû au comportement du driver `pg` avec les colonnes `DECIMAL`. Résolu par normalisation centralisée dans la couche service (voir section ci-dessus) plutôt que par un correctif ponctuel, pour éviter que le bug ne réapparaisse ailleurs (carte, calcul de distance).

## Limites connues / pistes d'amélioration

- Pas de pagination sur la liste des restaurants (non demandée, mais nécessaire à grande échelle)
- Pas de tests automatisés (non demandés dans le temps imparti du test)
- La recherche et le filtre ne se combinent pas (l'un remplace l'autre plutôt que de se cumuler)
- Le calcul de distance entre restaurants n'affiche que la distance à vol d'oiseau, pas d'itinéraire réel
