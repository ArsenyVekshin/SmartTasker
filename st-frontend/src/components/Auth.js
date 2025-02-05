import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/auth';
const AuthComponent = () => {
    const pagestyles={
        display: 'grid',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: ' #9df9ef',
    };
    const formstyles={
        gridRow: 2,
        color: ' #51e2f5',
        margin: 'auto',
        border: '10px solid #ffa8B6',
        padding: '10px',
        background: 'white',
    };
    const buttonstyles={
        // Основные стили
        padding: "10px 20px",
        fontSize: "18px",
        fontWeight: "bold",
        color: " ",
        textAlign: "center",
        border: "none",
        cursor: "pointer",
        borderRadius: "50px", // Закругленные углы
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Тень для объема
        background: ' #51e2f5'
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
            .catch((err) => {if(err.response.status < 500) setMessage(err.response.data.message); else setMessage('Ошибка сервера');})
        } else {
            if(/*password*/ e.target[1].value !== /*password repeat*/e.target[2].value)
                setMessage('Пароли должны совпадать!')
            else {
                register(e.target[0].value, e.target[1].value)
                .then(() => {navigate('/list')})
                .catch((err) => {if(err.response.status < 500) setMessage(err.response.data.message); else setMessage('Ошибка сервера');})
            }
        }
    };
    const navigate = useNavigate();
    useEffect(()=>{
        isIn().then((e)=>navigate('/list')).catch((e)=>{});
    },[isIn, navigate]);
    return (
        <div style={pagestyles}>
            <h1 style={{gridRow: 1, color: ' #edf7f6'}}>Очень даже неплохой дизайн для сайта</h1>
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
