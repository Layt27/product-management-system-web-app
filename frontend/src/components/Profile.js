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
	const [userName, setUserName] = useState(JSON.parse(auth).name);
	const [userEmail, setUserEmail] = useState(JSON.parse(auth).email);
	const [error, setError] = useState(false);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleConfirm = async() => {
		if(!userName || !userEmail) {
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

			// Regular expression to check if the name contains only letters or spaces
			const nameRegex = /^[a-zA-Z\s]+$/;
			if(!nameRegex.test(trimmedName)) {
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

			if(trimmedName.split(' ').length === 2 && trimmedEmail) {
				const content = {name: trimmedName, email: trimmedEmail};
				const res = await axios.put(`http://localhost:3005/profile/${params.id}`, content);
				console.log("User information has been updated.");

				// Reassign user details and save the new user info in the local storage
				authObject.name = userName;
				authObject.email = userEmail;
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
		setUserName(JSON.parse(auth).name);
		setUserEmail(JSON.parse(auth).email);
		setIsEditing(false);
	};

	return (
		<div className='profileDiv'>
		<h1>This is the Profile page!</h1>

		<div className='profile-details-container'>
			<h3>Account Details</h3>

			<div className='form-group'>
			<label>Name</label>
			<input className='profile-input' type='text' readOnly={!isEditing} value={userName} onChange={(e) => setUserName(e.currentTarget.value)}>

			</input>
			</div>

			<div className='form-group'>
			<label>Email</label>
			<input className='profile-input' type='text' readOnly={!isEditing} value={userEmail} onChange={(e) => setUserEmail(e.currentTarget.value)}></input>
			</div>

			<div className='form-group'>
			<label>Phone number</label>
			<input className='profile-input' type='text' readOnly={!isEditing} value='+971569876543'></input>
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