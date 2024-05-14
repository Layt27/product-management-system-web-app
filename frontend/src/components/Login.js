// Imports
import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import Logo from '../images/web-app-logo.png';

// Store backend url in a variable to use for requests
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth) {
            navigate('/');
        }

        setEmail('');
        setPassword('');
        setError(false);
    }, [location]);

    const handleLogin = async() => {
        if(!email || !password) {
            setError(true);
            return;
        } else {
            setError(false);
        }

        try{
            const content = {email, password};
            const res = await axios.post(`${REACT_APP_BACKEND_URL}login`, content,
            {headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://product-management-system-wa.vercel.app'
                }
            });
            if(res.data.auth) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('token', JSON.stringify(res.data.auth));
                navigate('/');
            }
        } catch(e) {
            if(e.response && e.response.status === 404) {
                console.log("User not found.", e.message);
                alert("User not found.");
            } else {
                console.log("An unexpected error occurred while logging in.", e.message);
                alert("An unexpected error occurred while logging in.");
            }
        }
    };

    return(
        <div className='loginDivPage'>
            <div className='loginDivContentBox'>
                <div className='loginDivImg'>
                    <a href='/login'>
                        <img src={Logo}
                            alt='logo'
                            className='loginLogo'
                        ></img>
                    </a>
                </div>

                <div className='loginDivForm'>
                    <h1>Log in</h1>

                    <label className='inputFieldLabels'>Email</label>
                    <input className='inputBox' type='text' placeholder='Enter email'
                        value={email} onChange={(e) => setEmail(e.currentTarget.value)}>
                    </input>
                    {error && !email && <span className='invalid-input'>This field cannot be left blank</span>}

                    <label className='inputFieldLabels'>Password</label>
                    <input className='inputBox' type='password' placeholder='Enter password'
                        value={password} onChange={(e) => setPassword(e.currentTarget.value)}>
                    </input>
                    {error && !password && <span className='invalid-input'>This field cannot be left blank</span>}

                    <button onClick={handleLogin} className='mainButtonTheme' type='button'>Log in</button>
                </div>
            </div>
        </div>
    );
};

export default Login;