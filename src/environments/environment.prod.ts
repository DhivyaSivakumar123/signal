import config from '../assets/config.json';

export const environment = {
  production: true,
  apiUrl: config?.apiUrl || 'https://gateway-service-871301543752.us-central1.run.app',
  get oauthRedirectUri(): string {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}/oauth-callback`;
    }
    return 'https://signal.app/oauth-callback';
  }
};
