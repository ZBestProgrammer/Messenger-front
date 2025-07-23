import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth';
import { setToken } from '../utils/storage';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => loginUser(data),
        onSuccess: (response) => {
            const token = response.data;
            if (token) {
                setToken(token);
                navigate('/');
            }
        },
        onError: () => {
            setErrorMsg('Неверные данные для входа');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        mutation.mutate({ username, password });
    };

    return (
        <form className="form-box" onSubmit={handleSubmit}>
            <h2>Вход</h2>
            {errorMsg && <div className="form-error">{errorMsg}</div>}
            <Input
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? 'Входим...' : 'Войти'}
            </Button>
        </form>
    );
}
