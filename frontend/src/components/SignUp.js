// Imports
import React, {useState, useEffect} from 'react';              // `useState` is a React hook that allows functional components to have state
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import Logo from '../images/web-app-logo.png';

// Store backend url in a variable to use for requests
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SignUp = () => {
    // `useState` hook creates three state variables (name, email, and password) and their corresponding setter functions (setName, setEmail, and setPassword)
    // These state variables are typically used to store and manage the values of input fields in a form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    // `useNavigate` hook used to navigate to diff pages in your app
    const navigate = useNavigate();

    // `useLocation` hook used to access the current location object. This object can be used to determine when the user navigates to a diff route
    const location = useLocation();

    // `useEffect` hook used to check if there is an authenticated user stored in the local storage and runs only once when component is mounted due to `[]`
    // Prevents user from accessing the signup page through the url if there's already an authenticated user stored in the local storage
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth) {
            navigate('/');
        }

        setName('');
        setEmail('');
        setMobileNumber('');
        setPassword('');
        setError(false);
    }, [location]);
    
    // Processes sign up of user. POST req done in this function
    const handleSignUp = async() => {
        if(!name || !email || !mobileNumber || !password) {
            setError(true);
            return false;
        } else {
            setError(false);
        }

        try{
            // Remove whitespaces surrounding other characters
            const trimmedName = name.trim();
            const trimmedEmail = email.trim();
            const trimmedMobileNumber = mobileNumber.trim();

            // Regular expression to check if the name is valid
            const nameRegex = /^[a-zA-Z\s]+$/;
            if(!nameRegex.test(trimmedName) || trimmedName.split(' ').length !== 2) {
                alert("Please enter a valid name.");
                return false;
            }

            // Regular expression to check if the email is valid
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(!emailRegex.test(trimmedEmail)) {
                alert("Please enter a valid email address.");
                return false;
            }

            // Regular expression to check if the mobile number is valid
            const mobileNumberRegex = /^\+\d{1,3}\d{3}\d{3}\d{4}$/;
            if(!mobileNumberRegex.test(trimmedMobileNumber)) {
                alert("Please enter a valid mobile number.");
                return false;
            }

            if(trimmedName && trimmedEmail && trimmedMobileNumber) {
                const content = {name: trimmedName, email: trimmedEmail, mobileNumber: trimmedMobileNumber, password};
                const res = await axios.post(`${REACT_APP_BACKEND_URL}/signup`, content);      // POST req to backend with `content` as req body
                localStorage.setItem('user', JSON.stringify(res.data.userResult));          // Stores user sign up data to local storage
                localStorage.setItem('token', JSON.stringify(res.data.auth));          // Stores token to local storage
                navigate('/');          // Redirect user to home page after signing up
            } else {
                alert("Please provide valid inputs in all fields.");
                return false;
            }
        } catch(e) {
            console.log("An unexpected error occurred while signing up.", e.message);
            alert("An unexpected error occurred while signing up.");
        }
    };

    // HTML code of webpage
    return(
        <div className='signUpDivPage'>
            <div className='signUpDivContentBox'>
                <div className='signUpDivImg'>
                    <a href='/login'>
                        <img src={Logo}
                            alt='logo'
                            className='signUpLogo'
                        ></img>
                    </a>
                </div>

                <div className='signUpDivForm'>
                    <h1>Create Account</h1>

                    <label className='inputFieldLabels'>Name</label>
                    <input className='inputBox' type='text' placeholder='Enter first name and last name'
                        value={name} onChange={(e) => setName(e.currentTarget.value)}>
                    </input>
                    {error && !name && <span className='invalid-input'>This field cannot be left blank</span>}

                    <label className='inputFieldLabels'>Email</label>
                    <input className='inputBox' type="text" placeholder='Enter email'
                        value={email} onChange={(e) => setEmail(e.currentTarget.value)}>
                    </input>
                    {error && !email && <span className='invalid-input'>This field cannot be left blank</span>}

                    <label className='inputFieldLabels'>Mobile number</label>
                    <input className='inputBox' type='text' placeholder='Enter mobile number'
                        value={mobileNumber} onChange={(e) => setMobileNumber(e.currentTarget.value)}>
                    </input>
                    {error && !mobileNumber && <span className='invalid-input'>This field cannot be left blank</span>}

                    <label className='inputFieldLabels'>Password</label>
                    <input className='inputBox' type='password' placeholder='Enter password'
                        value={password} onChange={(e) => setPassword(e.currentTarget.value)}>
                    </input>
                    {error && !password && <span className='invalid-input'>This field cannot be left blank</span>}

                    <button onClick={handleSignUp} className='mainButtonTheme' type='button'>Sign up</button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

