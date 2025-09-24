import { jwtDecode } from 'jwt-decode'

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

export function clearToken(): void {
  localStorage.removeItem('token')
}

export function getAuthHeaders(): { [key: string]: string } {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function isTokenValid(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    if (!exp) return false
    return Date.now() < exp * 1000
  } catch {
    return false
  }
}

export function logout(): void {
  localStorage.clear()
  window.location.href = '/'
}
