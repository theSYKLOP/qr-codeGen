# 🎯 Générateur QR - Interface Épurée 2025

Une application moderne et intuitive pour créer, gérer et modifier des codes QR avec une interface épurée noir et blanc.

## ✨ Fonctionnalités

### 🎨 Interface Utilisateur
- **Design minimaliste** : Interface épurée noir et blanc
- **Responsive** : Compatible mobile, tablette et desktop
- **Animations fluides** : Transitions et effets visuels modernes
- **Modals centrés** : Affichage optimal des QR codes générés

### 📱 Gestion des QR Codes
- **Création** : Génération de QR codes avec informations détaillées
- **Modification** : Édition des QR codes existants
- **Visualisation** : Aperçu en temps réel des QR codes
- **Téléchargement** : Export en format PNG haute qualité
- **Pagination** : Navigation par pages de 5 éléments

### 🔍 Recherche et Filtrage
- **Recherche globale** : Par nom de produit, franchise ou fournisseur
- **Filtrage par type** : Agriculture, Pisciculture, Légumes, Fruits, etc.
- **Tri intelligent** : Par date de création (plus récent en premier)

### 📊 Statistiques
- **Compteurs en temps réel** : Nombre de QR codes créés
- **Types de produits** : Diversité des catégories
- **Valeur totale** : Montant cumulé des produits

## 🛠️ Technologies Utilisées

### Frontend
- **Nuxt 4** : Framework Vue.js moderne
- **Vue 3** : Composition API et réactivité
- **CSS Modules** : Styles modulaires et variables CSS
- **Teleport** : Modals optimisés pour l'affichage

### Backend
- **Nitro** : Runtime serveur Nuxt
- **Prisma** : ORM pour la gestion de base de données
- **H3** : Utilitaires serveur performants

### Base de Données
- **PostgreSQL** : Base de données relationnelle robuste
- **Schéma optimisé** : Relations User ↔ QR Code

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Base de données PostgreSQL

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/theSYKLOP/qr-codeGen.git
cd qr-generator
```

2. **Installer les dépendances**
```bash
npm install
# ou
pnpm install
# ou
yarn install
```

3. **Configuration de la base de données**
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement
DATABASE_URL="postgresql://user:password@localhost:5432/qr_generator"
```

4. **Migration de la base de données**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📖 Utilisation

### Créer un QR Code
1. Remplir le formulaire avec les informations du produit
2. Sélectionner le type de produit (Agriculture, Fruits, etc.)
3. Saisir le prix en FCFA
4. Spécifier le poids et l'unité (g/kg)
5. Cliquer sur "Générer QR Code"
6. Prévisualiser et télécharger le QR code

### Modifier un QR Code
1. Cliquer sur un QR code dans la liste
2. Ouvrir le modal de détail
3. Cliquer sur "Modifier"
4. Modifier les informations dans le formulaire
5. Cliquer sur "Sauvegarder"

### Navigation
- **Pagination** : Naviguer entre les pages (5 QR codes par page)
- **Recherche** : Utiliser la barre de recherche pour filtrer
- **Filtres** : Sélectionner un type de produit spécifique

## 🏗️ Architecture

### Structure des Fichiers
```
├── components/
│   ├── QrForm.vue          # Formulaire de création/modification
│   └── QrList.vue          # Liste et pagination des QR codes
├── pages/
│   └── index.vue           # Page principale
├── server/api/
│   ├── qrcodes.get.ts      # Récupération des QR codes
│   ├── qrcodes.post.ts     # Création de QR codes
│   └── qrcodes.put.ts      # Modification de QR codes
├── prisma/
│   └── schema.prisma       # Schéma de base de données
└── assets/css/
    └── global.css          # Styles globaux
```

### Modèles de Données
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  nom       String?
  prenom    String?
  qrCodes   QrCode[]
}

model QrCode {
  id           String   @id @default(cuid())
  typeProduit  String
  nomProduit   String
  franchise    String
  prixVente    Int
  poids        Float
  unitePoids   String
  fournisseur  String
  codePng      String
  dateCreation DateTime @default(now())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
}
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build

# Base de données
npx prisma studio    # Interface d'administration Prisma
npx prisma migrate   # Gestion des migrations
npx prisma generate  # Génération du client Prisma
```

## 🌐 API Endpoints

### GET `/api/qrcodes`
Récupère les QR codes avec pagination et filtrage
```bash
GET /api/qrcodes?page=1&limit=5&search=banane&typeProduit=Agriculture
```

### POST `/api/qrcodes`
Crée un nouveau QR code
```json
{
  "typeProduit": "Agriculture",
  "nomProduit": "Banane",
  "franchise": "Prix Import",
  "prixVente": 10000,
  "poids": 1.5,
  "unitePoids": "kg",
  "fournisseur": "PROXI NOVA"
}
```

### PUT `/api/qrcodes?id=qr_code_id`
Modifie un QR code existant
```json
{
  "typeProduit": "Fruits",
  "nomProduit": "Banane Modifiée",
  "franchise": "Carrefour",
  "prixVente": 12000,
  "poids": 2.0,
  "unitePoids": "kg",
  "fournisseur": "Nouveau Fournisseur"
}
```

## 🎨 Personnalisation

### Variables CSS
L'application utilise des variables CSS pour une personnalisation facile :
```css
:root {
  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-light: #f9fafb;
  --color-success: #10b981;
  --color-error: #ef4444;
}
```

### Thèmes
- **Mode sombre** : Variables CSS prêtes pour l'implémentation
- **Couleurs personnalisées** : Facilement modifiables
- **Typographie** : Police système optimisée

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel --prod
```

### Autres Plateformes
- **Netlify** : Compatible avec Nuxt 4
- **Railway** : Déploiement avec base de données PostgreSQL
- **Docker** : Containerisation possible

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/votre-username/qr-generator/issues)
- **Discussions** : [GitHub Discussions](https://github.com/votre-username/qr-generator/discussions)
- **Email** : contact@votre-domaine.com

## 🙏 Remerciements

- **Nuxt Team** : Framework exceptionnel
- **Vue.js** : Réactivité et performance
- **Prisma** : ORM moderne et type-safe
- **H3** : Utilitaires serveur performants

---

**Développé avec ❤️ et Nuxt 4**