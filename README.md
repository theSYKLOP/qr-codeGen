# QR Generator - Interface de Gestion de Codes QR

Interface moderne pour générer et gérer vos codes QR facilement avec Nuxt 3 et Prisma.

## 🚀 Déploiement sur Vercel

### Prérequis

1. **Base de données PostgreSQL** : Créez une base de données PostgreSQL (Vercel Postgres, Supabase, PlanetScale, etc.)
2. **Compte Vercel** : Connectez votre compte GitHub à Vercel

### Configuration

#### 1. Variables d'Environnement

Dans votre projet Vercel, ajoutez ces variables d'environnement :

```bash
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

#### 2. Configuration de la Base de Données

1. **Vercel Postgres** (recommandé) :
   - Créez une base de données PostgreSQL dans Vercel
   - La variable `DATABASE_URL` sera automatiquement configurée

2. **Autres fournisseurs** :
   - Copiez l'URL de connexion PostgreSQL
   - Ajoutez-la comme variable `DATABASE_URL` dans Vercel

#### 3. Déploiement

1. **Connectez votre repo GitHub** à Vercel
2. **Configurez le projet** :
   - Framework : Nuxt
   - Build Command : `npm run vercel-build`
   - Output Directory : `.output`
3. **Déployez** : Vercel détectera automatiquement la configuration

### Structure du Projet

```
QR-Add/
├── components/          # Composants Vue
├── pages/              # Pages de l'application
├── server/api/         # API routes (H3)
├── prisma/             # Schéma et migrations Prisma
├── lib/                # Utilitaires (Prisma client)
├── types/              # Types TypeScript
├── vercel.json         # Configuration Vercel
└── nuxt.config.ts      # Configuration Nuxt
```

### Scripts de Déploiement

- `vercel-build` : Génère le client Prisma, applique les migrations et build l'app
- `dev` : Lance le serveur de développement
- `build` : Build l'application pour la production

## 🛠️ Développement Local

```bash
# Installation
npm install

# Base de données
npx prisma generate
npx prisma migrate dev

# Développement
npm run dev
```

## 📦 Technologies

- **Frontend** : Nuxt 3, Vue 3, TypeScript
- **Backend** : H3 (API routes), Prisma ORM
- **Base de données** : PostgreSQL
- **Déploiement** : Vercel
- **UI** : CSS personnalisé, FontAwesome

## 🔧 Configuration Prisma

Le projet utilise Prisma avec PostgreSQL. Assurez-vous que :

1. **Migrations** : Appliquées automatiquement lors du déploiement
2. **Client** : Généré automatiquement lors du build
3. **Variables d'environnement** : Configurées dans Vercel

## 🚨 Résolution des Erreurs

### Erreur de Configuration Vercel

Si vous rencontrez l'erreur `Config file was not found`, vérifiez :

1. **Fichier `vercel.json`** : Présent à la racine du projet
2. **Script `vercel-build`** : Défini dans `package.json`
3. **Variables d'environnement** : Configurées dans Vercel
4. **Base de données** : Accessible depuis Vercel

### Erreurs de Base de Données

1. **Vérifiez l'URL** : `DATABASE_URL` correcte
2. **Migrations** : Appliquées avec `prisma migrate deploy`
3. **Connexion** : Base de données accessible depuis Vercel

## 📝 Notes

- L'application utilise des migrations Prisma automatiques
- Le client Prisma est généré lors du build
- Les variables d'environnement sont gérées par Vercel
- L'API est serverless avec H3

---

**Auteur** : Mehdi OYONE  
**Version** : 1.0.0  
**Licence** : MIT