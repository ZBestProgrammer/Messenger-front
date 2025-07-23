import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => registerUser(data),
        onSuccess: () => {
            navigate('/login');
        },
        onError: () => {
            setErrorMsg('Ошибка регистрации');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');

        mutation.mutate({
            username,
            first_name: firstName,
            last_name: lastName,
            description,
            avatar: '',
            password,
        });
    };

    return (
        <form className="form-box" onSubmit={handleSubmit}>
            <h2>Регистрация</h2>
            {errorMsg && <div className="form-error">{errorMsg}</div>}

            <Input placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} />
            <Input placeholder="Имя" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <Input placeholder="Фамилия" value={lastName} onChange={e => setLastName(e.target.value)} />
            <Input placeholder="О себе (необязательно)" value={description} onChange={e => setDescription(e.target.value)} />
            <Input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />

            <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? 'Создаём...' : 'Создать аккаунт'}
            </Button>
        </form>
    );
}
