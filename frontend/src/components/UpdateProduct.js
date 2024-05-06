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
            console.log("An unexpected error occurred while updating the product's details.", e.message);
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