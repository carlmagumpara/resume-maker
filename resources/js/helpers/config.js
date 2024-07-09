// export const IS_DEV = import.meta.env['DEV'];

export const IS_DEV = false;

export const PROTOCOL = IS_DEV ? 'http://' : 'https://';
export const PORT = IS_DEV ? ':8000' : '';
export const BASE_URL = IS_DEV ? 'localhost' : 'locallinkup.online';
export const BASE_URL_WITH_PORT = `${PROTOCOL}${BASE_URL}${PORT}`;
export const API_URL = `${BASE_URL_WITH_PORT}/api`;
export const WEB_SOCKET_AUTH = `${API_URL}/broadcasting/auth`;