export interface User {
  id: string;
  email: string;
  name: string;
  orgId: string;
  role: 'MANAGER' | 'IC';
  oauthProvider: 'GOOGLE' | 'MICROSOFT';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
