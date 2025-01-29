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
        display: "inline-block",
        padding: "15px 30px",
        fontSize: "18px",
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        textDecoration: "none",
        border: "none",
        borderRadius: "50px", // Закругленные углы
        cursor: "pointer",
        background: "linear-gradient(red, blue)", // Разноцветный градиент
        backgroundSize: "300% 300%", // Увеличиваем размер градиента для анимации
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Тень для объема
        // transition: "all 0.4s ease", // Плавные переходы

        // Анимация градиента
        // animation: "gradientAnimation 8s ease infinite",

        // Эффект при наведении
        // '&:hover': {
        //     transform: "scale(1.05)", // Увеличение кнопки
        //     boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)", // Увеличение тени
        // },

        // // Эффект при нажатии
        // '&:active': {
        //     transform: "scale(0.95)", // Уменьшение кнопки
        // },
    };
    const [message, setMessage] = useState('');
    const {login, register, isIn} = useAuth();
    const [isAuth, setIsAuth] = useState(true);
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
