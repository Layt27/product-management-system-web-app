// Imports
import React, {useState} from 'react';

const Profile = () => {
  // State variables
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  }

  const handleConfirm = () => {
    setIsEditing(false);
  }

  const handleCancel = () => {
    setIsEditing(false);
  }

  return (
    <div className='profileDiv'>
      <h1>This is the Profile page!</h1>

      <div className='profile-details-container'>
        <h3>Account Details</h3>
        <div className='form-group'>
          <label>Name</label>
          <input className='profile-input' type='text' value='Jim Tool'></input>
        </div>

        <div className='form-group'>
          <label>Email</label>
          <input className='profile-input' type='text' value='abc@123.com'></input>
        </div>

        <div className='form-group'>
          <label>Phone number</label>
          <input className='profile-input' type='text' value='+971569876543'></input>
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