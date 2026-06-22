import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../auth/AuthProvider.tsx';
// @ts-ignore
import styles from "./LoginPage.module.css"

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/admin');
        } catch (err) {
            setError('Invalid username or password');
        }
    }

    return (
        <div className={styles["login-container"]}>
            <h1>ADMIN-LOGIN</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <input
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder=" "
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className={styles.field}>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder=" "
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <button type="submit">Log In</button>
                </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}