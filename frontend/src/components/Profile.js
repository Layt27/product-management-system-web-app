// Imports
import React, {useState, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

// Import dotenv package and load the environmental variables from the .env file
const dotenv = require('dotenv');
dotenv.config();

// Store backend url in a variable to use for requests
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  	// Obtain user details from local storage
	const auth = localStorage.getItem('user');
	// Convert the user details from local storage into an object
	const authObject = JSON.parse(auth);

	// State variables
	const [isEditing, setIsEditing] = useState(false);
	const [userName, setUserName] = useState(authObject.name);
	const [userEmail, setUserEmail] = useState(authObject.email);
	const [userMobileNumber, setUserMobileNumber] = useState(authObject.mobileNumber);
	const [error, setError] = useState(false);

	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

	useEffect(() => {
		setUserName(authObject.name);
		setUserEmail(authObject.email);
		setUserMobileNumber(authObject.mobileNumber);
		setIsEditing(false);
		setError(false);
	}, [location]);

	const handleEdit = () => {
		setIsEditing(true);
		setError(false);
	};

	const handleConfirm = async() => {
		if(!userName || !userEmail || !userMobileNumber) {
			setError(true);
			return;
		} else {
			setError(false);
		}

		try{
			// Remove whitespaces surrounding other characters
			const trimmedName = userName.trim();
			const trimmedEmail = userEmail.trim();
			const trimmedMobileNumber = userMobileNumber.trim();

			// Regular expression to check if the name is valid
			const nameRegex = /^[a-zA-Z\s]+$/;
			if(!nameRegex.test(trimmedName) || trimmedName.split(' ').length !== 2) {
				alert("Please enter a valid name.");
				return;
			}

			// Regular expression to check if the email is valid
			const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			if(!emailRegex.test(trimmedEmail)) {
				alert("Please enter a valid email address.");
				return;
			}

			// Regular expression to check if the mobile number is valid
            const mobileNumberRegex = /^\+\d{1,3}\d{3}\d{3}\d{4}$/;
            if(!mobileNumberRegex.test(trimmedMobileNumber)) {
				alert("Please enter a valid mobile number.");
                return;
            }

			if(trimmedName && trimmedEmail && trimmedMobileNumber) {
				const content = {name: trimmedName, email: trimmedEmail, mobileNumber: trimmedMobileNumber};
				await axios.put(`${REACT_APP_BACKEND_URL}profile/${params.id}`, content,
					{headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
				);

				// Reassign user details and save the new user info in the local storage
				authObject.name = userName;
				authObject.email = userEmail;
				authObject.mobileNumber = userMobileNumber;
				localStorage.setItem('user', JSON.stringify(authObject));

				setIsEditing(false);

				setTimeout(() => {
					alert("Account details updated.");
				}, 60);
			} else {
				alert("Please provide valid inputs in all fields.");
				return false;
			}
		} catch(e) {
			if(e.response && e.response.status === 404) {
				console.log("User not found.", e.message);
				alert("User not found.");
			} else if(e.response && e.response.status === 401) {
				alert("The token has expired. Please log in again.");
                logout();
			} else {
				console.log("An unexpected error occurred while updating user information.", e.message);
				alert("An unexpected error occurred while updating user information.");
			}
		}
	};

	const handleCancel = () => {
		setUserName(authObject.name);
		setUserEmail(authObject.email);
		setUserMobileNumber(authObject.mobileNumber)
		setIsEditing(false);
		setError(false);
	};

	return (
		<div className='profileDivPage'>
			<div className='profile-details-container'>
				<h3>Account Details</h3>

				<div className='form-group'>
					<label className='inputFieldLabels'>Name</label>
					<input className='profile-input' type='text' readOnly={!isEditing}
						value={userName} onChange={(e) => setUserName(e.currentTarget.value)}>
					</input>
					{error && !userName && <span className='invalid-input'>This field cannot be left blank</span>}
				</div>

				<div className='form-group'>
					<label className='inputFieldLabels'>Email</label>
					<input className='profile-input' type='text' readOnly={!isEditing}
						value={userEmail} onChange={(e) => setUserEmail(e.currentTarget.value)}>
					</input>
					{error && !userEmail && <span className='invalid-input'>This field cannot be left blank</span>}
				</div>

				<div className='form-group'>
					<label className='inputFieldLabels'>Mobile number</label>
					<input className='profile-input' type='text' readOnly={!isEditing}
						value={userMobileNumber} onChange={(e) => setUserMobileNumber(e.currentTarget.value)}>
					</input>
					{error && !userMobileNumber && <span className='invalid-input'>This field cannot be left blank</span>}
				</div>

				{
				!isEditing ? (
					<div className='profileButtonsDiv'>
						<button onClick={handleEdit} type='button'>Edit</button>
					</div>
				) : (
					<>
					<div className='profileButtonsDiv'>
						<button onClick={handleConfirm} type='button'>Confirm</button>
						<button onClick={handleCancel} type='button'>Cancel</button>
					</div>
					</>
				)
				}

			</div>
		</div>
	);
};

export default Profile;