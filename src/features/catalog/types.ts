export type ApiStatus =
  | 'stable'
  | 'draft'
  | 'review'
  | 'deprecated'
  | 'retired';

export type ApiDomain =
  | 'payments'
  | 'identity'
  | 'accounts'
  | 'kyc'
  | 'transactions'
  | 'cards'
  | 'notifications'
  | 'risk';

export type ApiProtocol = 'REST' | 'GraphQL' | 'AsyncAPI' | 'SOAP';

export type AuthMethod = 'OAuth2' | 'API Key' | 'mTLS' | 'JWT';

export interface ApiOwner {
  team: string;
  entity: string;
}

export interface Api {
  // Identité
  id: string;
  slug: string;
  name: string;
  description: string;

  // Classification
  domain: ApiDomain;
  protocol: ApiProtocol;
  version: string;
  status: ApiStatus;

  // Métriques
  score: number;
  consumersCount: number;
  updatedAt: string;

  // Gouvernance
  owner: ApiOwner;

  // Sécurité
  authMethods: AuthMethod[];

  // Tags libres
  tags: string[];
}
