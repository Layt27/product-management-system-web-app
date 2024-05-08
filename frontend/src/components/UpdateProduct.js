// Imports
import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';

const UpdateProduct = () => {
    const [name, setProductName] = useState('');
    const [price, setProductPrice] = useState('');
    const [category, setProductCategory] = useState('');
    const [company, setProductCompany] = useState('');
    const [error, setError] = useState(false);
    
    const params = useParams();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async() => {      // async callback function here because we will call API inside it and that will return a promise
        try{                                    // and to handle the promise, we have to use async and await
            const res = await axios.get(`http://localhost:3005/product/${params.id}`,
                {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
            );
            setProductName(res.data.result.name);
            setProductPrice(res.data.result.price);
            setProductCategory(res.data.result.category);
            setProductCompany(res.data.result.company);
        } catch(e) {
            if(e.response && e.response.status === 404) {
                console.log("Product not found.", e.message);
            } else if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else {
                console.log("An unexpected error occurred while retrieving the product's details.", e.message);
            }
        }
        
    };

    const handleUpdateProduct = async() => {
        if(!name || !price || !category || !company) {
            console.log("Please do not leave any field empty.");
            setError(true);
            return false;
        } else {
            setError(false);
        }

        try{
            // Remove whitespaces surrounding other characters
            const trimmedName = name.trim();
            let trimmedPrice = price.trim();
            const trimmedCategory = category.trim();
            const trimmedCompany = company.trim();

            if(!trimmedPrice.includes('.')) {               // Check if the price does not include a decimal point
                trimmedPrice += '.00';
            } else {
                const priceSplit = trimmedPrice.split('.');
                if(priceSplit[1].length === 1) {                // Check if the price only contains one digit after the decimal point
                    trimmedPrice += '0';
                }
            }
    
            // Regular expression to check if the price is valid
            const priceRegex = /^\d+(\.\d{1,2})?$/;
            if(!priceRegex.test(trimmedPrice)) {
                console.log("Please enter a valid price.");
                return false;
            }

            if(trimmedName && trimmedPrice && trimmedCategory && trimmedCompany) {
                const content = {name: trimmedName, price: trimmedPrice, category: trimmedCategory, company: trimmedCompany};
                const res = await axios.put(`http://localhost:3005/product/${params.id}`, content,
                    {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
                );
                if(res) {
                    setTimeout(() => {
                        alert("Product has been updated");
                    }, 60);

                    navigate('/');
                }
            } else {
                console.log("Please provide valid input in all fields.");
                // res.status(400).json({"result": "Please provide valid inputs in all fields"});
                return false;
            }
        } catch(e) {
            if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else {
                console.log("An unexpected error occurred while updating the product's details.", e.message);
            }
        }
    };

    return(
        <div className='updateProductDiv'>
            <h1>Update your product here!</h1>

            <input className='inputBox' type='text' placeholder='Enter name of product'
                value={name} onChange={(e) => setProductName(e.currentTarget.value)}>
            </input>
            {error && !name && <span className='invalid-input'>This field cannot be left blank</span>}

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

            <button onClick={handleUpdateProduct} className='signUpLoginButton' type='button'>Update product</button>
        </div>
    );
};

export default UpdateProduct;