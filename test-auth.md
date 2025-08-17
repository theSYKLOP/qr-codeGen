# Test d'authentification QR-Add

## Comptes créés

### 👑 Admin (sans 2FA)
- **Email** : `admin@qr-add.com`
- **Mot de passe** : `admin123`
- **Rôle** : `ADMIN`
- **2FA** : `false`
- **Comportement** : Connexion directe sans code de vérification

### 🔧 Modérateur (avec 2FA)
- **Email** : `moderateur@qr-add.com`
- **Mot de passe** : `mod123`
- **Rôle** : `MODERATEUR`
- **2FA** : `true`
- **Comportement** : Connexion avec code de vérification envoyé par email

### 👤 Utilisateurs (sans 2FA)
- **Email** : `user1@example.com` / `user2@example.com`
- **Mot de passe** : `user123`
- **Rôle** : `USER`
- **2FA** : `false`
- **Comportement** : Connexion directe

## Test des scénarios

### 1. Connexion Admin (sans 2FA)
1. Aller sur `/auth`
2. Saisir `admin@qr-add.com` / `admin123`
3. **Résultat attendu** : Connexion directe vers `/admin`

### 2. Connexion Modérateur (avec 2FA)
1. Aller sur `/auth`
2. Saisir `moderateur@qr-add.com` / `mod123`
3. **Résultat attendu** : Affichage du formulaire 2FA
4. Saisir le code affiché dans la console
5. **Résultat attendu** : Connexion vers `/admin`

### 3. Connexion Utilisateur (sans 2FA)
1. Aller sur `/auth`
2. Saisir `user1@example.com` / `user123`
3. **Résultat attendu** : Connexion directe vers `/admin`

## Logs de test

Les codes 2FA sont affichés dans la console du serveur :
```
Code 2FA pour moderateur@qr-add.com: 123456
```

## Base de données

Vérifier dans Prisma Studio (`npm run db:studio`) :
- Table `users` avec colonne `a2f`
- Admin : `a2f = false`
- Modérateur : `a2f = true`
- Utilisateurs : `a2f = false` 