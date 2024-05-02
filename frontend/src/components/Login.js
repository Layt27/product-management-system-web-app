// Imports
import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';

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
            console.log("Please do not leave any field empty.");
            setError(true);
            return;
        } else {
            setError(false);
        }

        try{
            console.log(email, password);

            const content = {email, password};
            const res = await axios.post('http://localhost:3005/login', content);
            console.log("This is the data:", await res.data);
            if(res.data.auth) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('token', JSON.stringify(res.data.auth));
                navigate('/');
            }
            // else {
            //     console.log("Please enter the correct details.");
            // }
        } catch(e) {
            if(e.response && e.response.status === 404) {
                console.log("User not found.", e.message);
            } else {
                console.log("An unexpected error occurred while logging in.", e.message);
            }
        }
    };

    return(
        <div className='loginDiv'>
            <h1>Log in</h1>

            <input className='inputBox' type='text' placeholder='Enter email'
                value={email} onChange={(e) => setEmail(e.currentTarget.value)}>
            </input>
            {error && !email && <span className='invalid-input'>This field cannot be left blank</span>}

            <input className='inputBox' type='password' placeholder='Enter password'
                value={password} onChange={(e) => setPassword(e.currentTarget.value)}>
            </input>
            {error && !password && <span className='invalid-input'>This field cannot be left blank</span>}

            <button onClick={handleLogin} className='signUpLoginButton' type='button'>Log in</button>
        </div>
    );
};

export default Login;