# Solis Developer Portal — Frontend

> **À Claude Code** : ce fichier décrit le projet, les conventions, et la façon dont je veux que tu m'aides. Lis-le à chaque session avant de proposer du code.

## Contexte produit

**Solis** est une **API Registry d'entreprise** open-core, multi-gateway, qui sert de source de vérité unique pour toutes les APIs d'une organisation. Le **Developer Portal** est l'interface utilisateur qui permet aux développeurs de découvrir, consulter, souscrire et tester les APIs publiées dans la registry.

L'objectif du portal suit le **principe des 5/5/5 de Mercedes** :
- 5 secondes pour comprendre ce que fait une API
- 5 minutes pour savoir comment s'y interfacer
- 5 heures pour la mettre en production

**Backend** : Python FastAPI (séparé, pas dans ce repo). Frontend talks to backend via REST API.

## Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite** (build tool, dev server)
- **React Router v6** (routing)
- **TanStack Query** (state serveur, cache)
- **CSS Modules** (styling, voir section dédiée)
- **Inter font** (Google Fonts)
- **Vitest** (tests, plus tard)

Pas de : Redux, styled-components, Tailwind, Material UI, Bootstrap.

## Architecture — feature-based, pas type-based

L'organisation suit la **logique métier**, pas le type de fichier. C'est aligné avec la façon dont l'équipe backend organise son code (DDD, modules par domaine business).

```
src/
├── app/                    # Plomberie globale
│   ├── App.tsx
│   ├── routes.tsx          # Définition des routes
│   ├── providers.tsx       # QueryClient, Router, Auth context
│   └── main.tsx
│
├── features/               # Une feature = un domaine métier
│   ├── auth/
│   │   ├── components/     # LoginForm, etc.
│   │   ├── hooks/          # useAuth, useLogin
│   │   ├── api/            # appels API auth
│   │   └── types.ts
│   ├── catalog/            # ⭐ FOCUS ACTUEL
│   │   ├── components/     # ApiCard, CatalogGrid, FilterBar
│   │   ├── hooks/          # useApiList, useApiFilters
│   │   ├── api/            # GET /apis, etc.
│   │   ├── types.ts        # Api, ApiVersion, ApiStatus
│   │   └── CatalogPage.tsx
│   ├── api-detail/
│   ├── subscription/
│   └── search-ai/
│
├── shared/                 # Réutilisable, agnostique du métier
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Input/
│   │   └── Layout/         # Header, Sidebar, Container
│   ├── hooks/              # useDebounce, useLocalStorage
│   └── lib/                # apiClient, utils, formatters
│
├── styles/
│   ├── tokens.css          # Design tokens (Aurore)
│   └── globals.css         # Resets globaux uniquement
│
└── types/                  # Types globaux (User, ApiResponse<T>)
```

### Règles de placement

- Un composant **utilisé par 1 seule feature** → reste dans `features/<feature>/components/`
- Un composant **utilisé par 2+ features** OU **agnostique du métier** → migre dans `shared/components/`
- Pas de dossier `utils/` fourre-tout. Les utilitaires vivent au plus près de leur usage.

## Styling — CSS Modules

**Aucune classe globale dans les composants** sauf utility class de `tokens.css` (`.solis-card`, `.solis-btn`).

Chaque composant a son `.module.css` à côté :

```tsx
// Button.tsx
import styles from './Button.module.css';

export function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={styles[variant]}>{children}</button>;
}
```

```css
/* Button.module.css */
.primary {
  background: var(--solis-primary-900);
  color: var(--solis-text-inverted);
  padding: 10px 18px;
  border-radius: var(--solis-radius-md);
  border: none;
  cursor: pointer;
  font-weight: var(--solis-weight-medium);
  transition: background var(--solis-transition-fast);
}

.primary:hover {
  background: var(--solis-primary-800);
}
```

**Toujours utiliser les CSS variables Solis** (`var(--solis-*)`), jamais de hex hardcodé. Cela garantit la cohérence et permet de basculer entre identités (Aurore ↔ Nocturne) en changeant juste l'import de tokens.

**Toujours utiliser les aliases sémantiques** (`var(--solis-text-brand)`) plutôt que les couleurs brutes (`var(--solis-primary-900)`). Ça facilitera le dark mode plus tard.

## Conventions TypeScript

- **strict: true** dans tsconfig
- Types explicites pour les props (interface `ButtonProps`, pas `type`)
- Pas de `any`. Si vraiment nécessaire, utiliser `unknown` puis narrower
- Les types métier vivent dans `features/<feature>/types.ts`
- Export nommés, jamais `export default` (sauf pour les pages route-level)

## Conventions React

- **Composants fonctionnels uniquement**, hooks pour la logique
- **Props destructurées** dans la signature, avec valeurs par défaut
- **Pas de business logic dans les composants** — extraire dans des hooks (`useApiList`, `useFilters`)
- **TanStack Query pour TOUS les appels API**, jamais `fetch` ou `useEffect` direct

## Conventions de nommage

| Type | Convention | Exemple |
|------|-----------|---------|
| Composants | PascalCase | `ApiCard.tsx` |
| Hooks | camelCase + `use` | `useApiList.ts` |
| Types | PascalCase | `Api`, `ApiStatus` |
| Variables CSS modules | camelCase | `styles.cardHeader` |
| Fichiers de page | PascalCase + `Page` | `CatalogPage.tsx` |

## Données mock

**Pour aujourd'hui, tout est mocké côté frontend.** Pas d'appel à un backend réel.

Les mocks vivent dans `features/<feature>/api/mock.ts` et sont importés par les hooks. Quand le backend FastAPI sera prêt, on remplace juste l'implémentation des fonctions API sans toucher aux composants.

Exemple :
```ts
// features/catalog/api/mock.ts
export const mockApis: Api[] = [
  {
    id: '1',
    name: 'Payments API',
    description: 'Initier, capturer et rembourser des paiements en temps réel',
    domain: 'payments',
    version: 'v3.2',
    status: 'stable',
    score: 87,
  },
  // ...
];
```

## Comment je veux que tu travailles avec moi

1. **Plan d'abord, code après**. Pour toute tâche non-triviale, propose un plan en 3-6 étapes que je valide avant que tu ne commences à modifier des fichiers.

2. **Petits PR mentaux**. Si une tâche touche plus de 5 fichiers, découpe-la et propose une séquence.

3. **Pas de sur-ingénierie**. On est en MVP, on construit avec ce qu'on a. Pas de Storybook, pas de Redux, pas d'i18n aujourd'hui. Si tu penses qu'on en aura besoin plus tard, ajoute un commentaire `// TODO:` plutôt que de l'implémenter maintenant.

4. **Cohérence avec les tokens**. Refuse de hardcoder des couleurs ou des espacements. Si quelque chose manque dans `tokens.css`, propose un ajout au fichier plutôt qu'une exception.

5. **Explique tes choix d'archi**. Quand tu crées un nouveau dossier ou que tu places un composant dans `shared/` vs `features/`, dis-moi pourquoi en une phrase.

6. **Pas de placeholder lorem ipsum**. Pour les mocks d'APIs, utilise des noms réalistes inspirés du contexte BPCE / banking : Payments API, Customer Identity API, Account Statements API, Transaction Search API, KYC Verification API, etc.

## État actuel du projet

- ✅ Tokens CSS prêts (`src/styles/tokens.css` — direction Aurore)
- ⏳ Structure de dossiers à créer
- ⏳ Setup Vite + TS + React Router + TanStack Query
- ⏳ Layout global (Header, container)
- ⏳ Page catalogue avec ApiCard et grille
- ⏳ Filtres simples (par domaine, par statut)
- ❌ Login, détail API, souscription, recherche IA — pour plus tard

## Inspirations visuelles à garder en tête

- **Linear** pour la densité d'information et la qualité de la typographie
- **Vercel** pour la sobriété et le rythme vertical
- **Mercedes Dev Portal** pour la signature visuelle forte du brand
- **Stripe** pour la documentation API

Évite : effets glassmorphism, gradients, ombres marquées, animations excessives.
