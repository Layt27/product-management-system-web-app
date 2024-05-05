// Imports
import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  	// Obtain user details from local storage
	const auth = localStorage.getItem('user');
	// Convert the user details from local storage into an object
	const authObject = JSON.parse(auth);
	

	const params = useParams();

	// State variables
	const [isEditing, setIsEditing] = useState(false);
	const [userName, setUserName] = useState(authObject.name);
	const [userEmail, setUserEmail] = useState(authObject.email);
	const [userMobileNumber, setUserMobileNumber] = useState(authObject.mobileNumber);
	const [error, setError] = useState(false);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleConfirm = async() => {
		if(!userName || !userEmail || !userMobileNumber) {
			console.log("Please do not leave any field empty.");
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
				console.log("Please enter a valid name.");
				// res.status(400).json({"result": "Please enter a valid name"});
				return;
			}

			// Regular expression to check if the email is valid
			const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			if(!emailRegex.test(trimmedEmail)) {
				console.log("Please enter a valid email address.");
				// res.status(400).json({"result": "Please enter a valid email address"});
				return;
			}

			// Regular expression to check if the mobile number is valid
            const mobileNumberRegex = /^\+\d{1,3}\d{3}\d{3}\d{4}$/;
            if(!mobileNumberRegex.test(trimmedMobileNumber)) {
                console.log("Please enter a valid mobile number.");
                // res.status(400).json({"result": "Please enter a valid mobile number"});
                return;
            }

			if(trimmedName && trimmedEmail && trimmedMobileNumber) {
				const content = {name: trimmedName, email: trimmedEmail, mobileNumber: trimmedMobileNumber};
				await axios.put(`http://localhost:3005/profile/${params.id}`, content,
					{headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
				);
				console.log("User information has been updated.");

				// Reassign user details and save the new user info in the local storage
				authObject.name = userName;
				authObject.email = userEmail;
				authObject.mobileNumber = userMobileNumber;
				localStorage.setItem('user', JSON.stringify(authObject));

				setIsEditing(false);
			} else {
				console.log("Please provide valid inputs in all fields.");
				return false;
			}
		} catch(e) {
			if(e.response && e.response.status === 404) {
				console.log("User not found.", e.message);
			} else {
				console.log("An unexpected error occurred while updating user information.", e.message);
			}
		}
	};

	const handleCancel = () => {
		setUserName(authObject.name);
		setUserEmail(authObject.email);
		setUserMobileNumber(authObject.mobileNumber)
		setIsEditing(false);
	};

	return (
		<div className='profileDiv'>
		<h1>This is the Profile page!</h1>

		<div className='profile-details-container'>
			<h3>Account Details</h3>

			<div className='form-group'>
				<label>Name</label>
				<input className='profile-input' type='text' readOnly={!isEditing}
					value={userName} onChange={(e) => setUserName(e.currentTarget.value)}>
				</input>
			</div>

			<div className='form-group'>
				<label>Email</label>
				<input className='profile-input' type='text' readOnly={!isEditing}
					value={userEmail} onChange={(e) => setUserEmail(e.currentTarget.value)}>
				</input>
			</div>

			<div className='form-group'>
				<label>Mobile number</label>
				<input className='profile-input' type='text' readOnly={!isEditing}
					value={userMobileNumber} onChange={(e) => setUserMobileNumber(e.currentTarget.value)}>
				</input>
			</div>

			{
			!isEditing ? (
				<button id='edit-button' className='profile-buttons' onClick={handleEdit} type='button'>Edit</button>
			) : (
				<>
				<button id='cancel-button' className='profile-buttons' onClick={handleCancel} type='button'>Cancel</button>
				<button id='confirm-button' className='profile-buttons' onClick={handleConfirm} type='button'>Confirm</button>
				</>
			)
			}

		</div>
		</div>
	);
};

export default Profile;