// Imports
import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
    const [name, setProductName] = useState('');
    const [price, setProductPrice] = useState('');
    const [category, setProductCategory] = useState('');
    const [company, setProductCompany] = useState('');
    const [error, setError] = useState(false);          // Used for form validation

    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {           // Runs a callback function whenever the location object changes to reset all input fields
        setProductName('');
        setProductPrice('');
        setProductCategory('');
        setProductCompany('');
        setError(false);
    }, [location]);

    const handleAddProduct = async() => {
        if(!name || !price || !category || !company) {      // Form validation to check for empty input fields after button click
            console.log("Please do not leave any field empty.");
            setError(true);
            return false;
        } else {
            setError(false);
        }

        try{
            console.log(name, price, category, company);

            // Remove whitespaces surrounding other characters
            const trimmedName = name.trim();
            const trimmedPrice = price.trim();
            const trimmedCategory = category.trim();
            const trimmedCompany = company.trim();

            if(trimmedName && trimmedPrice && trimmedCategory && trimmedCompany) {
                // Loop through every character for the 'price' value and reject any input other than valid numbers such as 250, 62.8, 0.99, etc.
                for(let i = 0; i < trimmedPrice.length; i++) {
                    if((isNaN(trimmedPrice.charAt(i)) && trimmedPrice.charAt(i) !== ".") || trimmedPrice.charAt(0) === "." || trimmedPrice.charAt(i) === " ") {
                        console.log("Please only include valid numbers in the price field. Ex: 250, 62.8, 0.99");
                        // res.status(400).json({"result": "Please only include valid numbers in the price field. Ex: 250, 62.8, 0.99"});
                        return false;
                    }
                }

                // const userId = JSON.parse(localStorage.getItem('user'))._id;
                const content = {trimmedName, trimmedPrice, trimmedCategory, trimmedCompany};       // removed userId from the 'content' object
                const res = await axios.post('http://localhost:3005/add-product', content,
                    {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
                );
                console.log("This is the data:", await res.data);

                // Clear input fields
                setProductName('');
                setProductPrice('');
                setProductCategory('');
                setProductCompany('');

                setTimeout(() => {          // Delay the alert by 60 milliseconds
                    alert("Product added to product list");
                }, 60);
            } else {
                console.log("Please provide valid inputs in all fields.");
                // res.status(400).json({"result": "Please provide valid inputs in all fields"});
                return false;
            }
        } catch(e) {
            if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else {
                console.log("An unexpected error occurred while adding a product.", e.message);
            }
        }
    };

    return(
        <div className='addProductDiv'>
            <h1>Add product here!</h1>

            <input className='inputBox' type='text' placeholder='Enter name of product'
                value={name} onChange={(e) => setProductName(e.currentTarget.value)}>
            </input>
            {error && !name && <span className='invalid-input'>This field cannot be left blank</span>}   {/* Conditional rendering statement in JSX */}

            <input className='inputBox' type='text' placeholder='Enter price of product'
                value={price} onChange={(e) => setProductPrice(e.currentTarget.value)}>
            </input>
            {error && !price && <span className='invalid-input'>This field cannot be left blank</span>}

            <input className='inputBox' type='text' placeholder='Enter category of product'
                value={category} onChange={(e) => setProductCategory(e.currentTarget.value)}>
            </input>
            {error && !category && <span className='invalid-input'>This field cannot be left blank</span>}

            <input className='inputBox' type='text' placeholder='Enter product company'
                value={company} onChange={(e) => setProductCompany(e.currentTarget.value)}>
            </input>
            {error && !company && <span className='invalid-input'>This field cannot be left blank</span>}

            <button onClick={handleAddProduct} className='signUpLoginButton' type='button'>Add product</button>
        </div>
    );
};

export default AddProduct;