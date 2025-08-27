// Cookie utility functions for authentication

export function setCookie(name: string, value: string, options: {
  path?: string;
  maxAge?: number;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
} = {}) {
  const {
    path = '/',
    maxAge = 3600,
    secure = true,
    sameSite = 'strict'
  } = options;

  let cookieString = `${name}=${value}; path=${path}`;
  
  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }
  
  if (secure) {
    cookieString += '; secure';
  }
  
  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export function deleteCookie(name: string, path: string = '/') {
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function clearAllCookies() {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookie(name.trim());
  }
}
