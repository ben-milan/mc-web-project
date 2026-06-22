const API_URL = process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:3001/';

export async function login(username: string, password: string) {

    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json() as Promise<{accessToken: string; role: string}>;
}

export function saveToken(token: string) {
    localStorage.setItem('access_token', token);
}

export function getToken(): string | null {
    return localStorage.getItem('access_token');
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

export function parseRole(): string | null {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role ?? null;
    } catch {
        return null;
    }
}