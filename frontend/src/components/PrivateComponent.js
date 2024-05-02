import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

const PrivateComponent = () => {
    const auth = localStorage.getItem('user');
    return auth ? <Outlet /> : <Navigate to="/login" />           // IF auth is true then go to Outlet otherwise Navigate to signup page
}

export default PrivateComponent;