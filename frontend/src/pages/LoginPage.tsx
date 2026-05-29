import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../auth/AuthProvider.tsx';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/admin');
        } catch {
            setError('Invalid username or password');
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Log In</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}