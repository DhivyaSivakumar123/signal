import config from '../assets/config.json';

function sanitizeApiUrl(url?: string): string {
  const defaultUrl = 'https://gateway-service-644308977417.us-central1.run.app';
  if (!url) return defaultUrl;
  try {
    return new URL(url.trim()).origin;
  } catch {
    return url.trim().replace(/\/+$/, '');
  }
}

export const environment = {
  production: true,
  apiUrl: sanitizeApiUrl(config?.apiUrl),
  get oauthRedirectUri(): string {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}/oauth-callback`;
    }
    return 'https://signal.app/oauth-callback';
  }
};
