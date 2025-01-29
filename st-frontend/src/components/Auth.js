import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/auth';
const AuthComponent = () => {
    const pagestyles={
        display: 'grid',
        gap: '10px',
        'align-items': 'center',
        'justify-content': 'center',
        height: '100vh',
        background: 'rgba(129, 241, 249, 0.78)'
    };
    const formstyles={
        'grid-column': 2,
        color: ' #9f8a03',
        margin: 'auto',
        border: '10px solid #9f9f03',
        padding: '10px',
        background: 'white',
    };
    const buttonstyles={
        // Основные стили
        padding: "10px 20px",
        fontSize: "18px",
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        border: "none",
        cursor: "pointer",
        borderRadius: "50px", // Закругленные углы
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Тень для объема
    };
    const [message, setMessage] = useState('');
    const {login, register, isIn} = useAuth();
    const [isAuth, setIsAuth] = useState(true);
    buttonstyles['background'] = !isAuth ? 
    "linear-gradient(red, orange, yellow, green, cyan, indigo, purple)" : // Разноцветный градиент
    " #a0c0a0";
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        if(isAuth) {
            login(/*login*/ e.target[0].value, /*password*/ e.target[1].value)
            .then(() => {navigate('/list')})
            .catch(() => {setMessage('Ошибка сервера')})
        } else {
            if(/*password*/ e.target[1].value !== /*password repeat*/e.target[2].value)
                setMessage('Пароли должны совпадать!')
            else {
                register(e.target[0].value, e.target[1].value)
                .then(() => {navigate('/list')})
                .catch(() => {setMessage('Ошибка сервера')})
            }
        }
    };
    const navigate = useNavigate();
    if(isIn())
        navigate('/list');
    return (
        <div style={pagestyles}>
            <h1 style={{'grid-column': 1}}>Очень даже неплохой дизайн для сайта</h1>
            <form style={formstyles} onSubmit={handleSubmit}>
                <p>Логин: <input type='text' name='login' placeholder='Логин' required /></p>
                <p>Пароль: <input type='password' name='password' placeholder='Пароль' required /></p>
                {!isAuth && <p>Повторите пароль: <input type='password' name='password_repeat' placeholder='Повторите пароль' required /></p>}
                <button type='submit' style={buttonstyles}>{isAuth?'Авторизация':'Регистрация'}</button>
                {isAuth && <button type='button' onClick={()=>setIsAuth(false)}>Нет аккаунта?</button>}
                {!isAuth && <button type='button' onClick={()=>setIsAuth(true)}>Уже есть аккаунт</button>}
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}
export default AuthComponent;
