# 🚀 Guide de Déploiement Vercel

## 📋 Prérequis

1. **Compte Vercel** : Créez un compte sur [vercel.com](https://vercel.com)
2. **Repository GitHub** : Votre code doit être sur GitHub
3. **Base de données PostgreSQL** : Vercel Postgres, Supabase, PlanetScale, etc.

## 🔧 Configuration Vercel

### 1. Connexion du Repository

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Sélectionnez le framework "Nuxt"

### 2. Configuration du Projet

Dans les paramètres du projet Vercel :

```bash
# Build Command
npm run vercel-build

# Output Directory
.output

# Install Command
npm install
```

### 3. Variables d'Environnement

Ajoutez ces variables dans Vercel :

```bash
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

## 🗄️ Configuration Base de Données

### Option 1 : Vercel Postgres (Recommandé)

1. **Créer une base de données** :
   - Dans votre projet Vercel
   - Allez dans "Storage" → "Create Database"
   - Sélectionnez "Postgres"
   - Choisissez votre région

2. **Variables automatiques** :
   - `DATABASE_URL` sera automatiquement configurée
   - `POSTGRES_URL` sera également disponible

### Option 2 : Supabase

1. **Créer un projet Supabase** :
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Récupérez l'URL de connexion

2. **Configurer les variables** :
   ```bash
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```

### Option 3 : PlanetScale

1. **Créer une base de données** :
   - Allez sur [planetscale.com](https://planetscale.com)
   - Créez un nouveau projet
   - Récupérez l'URL de connexion

2. **Configurer les variables** :
   ```bash
   DATABASE_URL=mysql://[username]:[password]@[host]/[database]
   ```

## 🔄 Migrations de Base de Données

### Première Déploiement

1. **Localement** :
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Sur Vercel** :
   - Les migrations seront appliquées automatiquement
   - Vérifiez les logs de build

### Migrations Futures

1. **Développement local** :
   ```bash
   npx prisma migrate dev --name [nom_migration]
   ```

2. **Déploiement** :
   - Les migrations seront appliquées automatiquement
   - Vérifiez que la base de données est accessible

## 🛠️ Scripts de Déploiement

### Script `vercel-build`

```json
{
  "scripts": {
    "vercel-build": "node scripts/deploy.js"
  }
}
```

### Script de Déploiement (`scripts/deploy.js`)

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Démarrage du déploiement Vercel...');

try {
  // 1. Générer le client Prisma
  console.log('📦 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // 2. Appliquer les migrations
  console.log('🗄️ Application des migrations...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations appliquées avec succès');
  } catch (migrationError) {
    console.log('⚠️ Erreur lors des migrations, continuation...');
  }
  
  // 3. Build de l'application
  console.log('🏗️ Build de l\'application...');
  execSync('npx nuxt build', { stdio: 'inherit' });
  
  console.log('✅ Déploiement terminé avec succès !');
  
} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error.message);
  process.exit(1);
}
```

## 🔍 Vérification du Déploiement

### 1. Endpoint de Santé

Vérifiez que l'application fonctionne :

```bash
curl https://votre-app.vercel.app/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "configured"
}
```

### 2. Logs de Build

Dans Vercel, vérifiez les logs de build :

1. Allez dans votre projet Vercel
2. Cliquez sur "Deployments"
3. Sélectionnez le dernier déploiement
4. Vérifiez les logs pour les erreurs

### 3. Variables d'Environnement

Vérifiez que les variables sont correctement configurées :

1. Dans votre projet Vercel
2. Allez dans "Settings" → "Environment Variables"
3. Vérifiez que `DATABASE_URL` est présente

## 🚨 Résolution des Erreurs

### Erreur : "Config file was not found"

**Solution** :
1. Vérifiez que `vercel.json` est présent à la racine
2. Vérifiez que le script `vercel-build` est défini
3. Redéployez le projet

### Erreur : "Can't reach database server"

**Solution** :
1. Vérifiez l'URL de la base de données
2. Vérifiez que la base de données est accessible depuis Vercel
3. Vérifiez les paramètres de sécurité (firewall, etc.)

### Erreur : "Migration failed"

**Solution** :
1. Vérifiez que les migrations sont à jour
2. Vérifiez les permissions de la base de données
3. Vérifiez les logs de migration

### Erreur : "Build failed"

**Solution** :
1. Vérifiez les dépendances dans `package.json`
2. Vérifiez la configuration Nuxt
3. Vérifiez les logs de build détaillés

## 📊 Monitoring

### Logs Vercel

- **Build logs** : Vérifiez les logs de build
- **Function logs** : Vérifiez les logs des API routes
- **Error tracking** : Utilisez les outils de monitoring Vercel

### Base de Données

- **Vercel Postgres** : Monitoring intégré
- **Supabase** : Dashboard de monitoring
- **PlanetScale** : Analytics de performance

## 🔄 Mises à Jour

### Déploiement Automatique

1. **GitHub Integration** : Déploiement automatique sur push
2. **Preview Deployments** : Tests sur les pull requests
3. **Production Deployments** : Déploiement sur la branche main

### Migrations de Base de Données

1. **Développement** : `npx prisma migrate dev`
2. **Production** : Appliquées automatiquement lors du déploiement
3. **Rollback** : Utilisez les outils de votre fournisseur de base de données

## 📝 Notes Importantes

- **Variables d'environnement** : Toujours configurées dans Vercel
- **Migrations** : Appliquées automatiquement lors du déploiement
- **Client Prisma** : Généré automatiquement lors du build
- **API Routes** : Serverless functions sur Vercel
- **Base de données** : Doit être accessible depuis Vercel

---

**Support** : Si vous rencontrez des problèmes, vérifiez les logs Vercel et les variables d'environnement. 