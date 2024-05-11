// Imports
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Nav = () => {
    const auth = localStorage.getItem('user');
    
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return(
        <div> 
            {
                auth ?
                    <>
                    <a href='/'>
                        <img src='https://seekvectorlogo.com/wp-content/uploads/2018/01/enterprise-products-vector-logo.png'
                            alt='logo'
                            className='nav-logo'
                        ></img>
                    </a>
                    <ul className='nav-ul'>
                        <li><Link to="/">Products</Link></li>
                        <li><Link to="/add-product">Add Product</Link></li>
                        {/* <li><Link to="/update">Update Product</Link></li> */}
                        <li style={{'float': 'right'}}><Link onClick={logout} to="/login">Log out ({JSON.parse(auth).name})</Link></li>
                        <li style={{'float': 'right'}}><Link to={"/profile/" + JSON.parse(auth)._id}>Profile</Link></li>
                    </ul>
                    </>
                :
                    <ul className='nav-ul nav-right'>
                        <li><Link to="/login">Log in</Link></li>
                        <li><Link to="/signup">Sign up</Link></li>
                    </ul>
                    
            }
        </div>
    );
};

export default Nav;