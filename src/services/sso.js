import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const ssoLogin = async (code, redirectUri) => {
  const { data } = await apiClient.post('/auth/sso-login', { code, redirect_uri: redirectUri });
  return data;
};

export const buildSsoAuthorizeUrl = (state) => {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_APP_SSO_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_APP_SSO_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    state,
  });
  return `${import.meta.env.VITE_APP_SSO_AUTHORIZE_URL}?${params.toString()}`;
};

export const generateState = () => {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
};