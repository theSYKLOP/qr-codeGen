# Base de données - QR-Add

## Seeding de la base de données

Ce dossier contient le script de seed pour initialiser la base de données avec des données par défaut.

### Compte Admin par défaut

Le script de seed crée automatiquement un compte administrateur :

- **Email** : `admin@qr-add.com`
- **Mot de passe** : `admin123`
- **Rôle** : `ADMIN`
- **Nom** : Administrateur QR-Add

### Utilisateurs de test

Le script crée également quelques utilisateurs de test :

- **user1@example.com** / `user123`
- **user2@example.com** / `user123`

### Exécution du seed

```bash
# Installer les dépendances si nécessaire
npm install

# Générer le client Prisma
npm run db:generate

# Exécuter le seed
npm run db:seed
```

### Commandes utiles

```bash
# Voir la base de données dans Prisma Studio
npm run db:studio

# Appliquer les migrations
npm run db:migrate

# Pousser le schéma vers la base de données
npm run db:push
```

### Sécurité

⚠️ **Important** : Changez le mot de passe admin par défaut en production !

Le script vérifie si l'admin existe déjà avant de le créer, donc il est sûr de l'exécuter plusieurs fois. 