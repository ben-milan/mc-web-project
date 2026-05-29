import { createContext, useContext, useState } from 'react';
// @ts-ignore
import { getToken, removeToken, parseRole, saveToken, login as apiLogin } from '../services/authService.tsx';
import * as React from "react";

type AuthContextType = {
    token: string | null;
    role: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
    const [token, setToken] = useState<string | null>(getToken());
    const [role, setRole] = useState<string | null>(parseRole());

    async function login(username: string, password: string) {
        const data = await apiLogin(username, password);
        saveToken(data.access_token);
        setToken(data.access_token);
        setRole(data.role);
    }

    function logout() {
        removeToken();
        setToken(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}