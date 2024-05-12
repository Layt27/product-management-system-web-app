// Imports
import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        getProducts();
    }, [location]);

    const getProducts = async() => {
        try{
            const res = await axios.get('http://localhost:3005/products',
                {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}   // Sends the token to the Authorization header to authenticate requests
            );
            console.log("This is the data:", await res.data);
            setProducts(res.data.products);
        } catch(e) {
            if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else {
                console.log("An unexpected error occurred while retrieving products.", e.message);
            }
        }
    };

    const handleDelete = async(productId) => {
        try{
            console.log(productId);
            const res = await axios.delete(`http://localhost:3005/product/${productId}`,
                {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
            );
            console.log("This is the DELETE req data:", await res.data);
            
            getProducts();

            setTimeout(() => {
                alert("Product has been deleted");
            }, 60);
        } catch(e) {
            if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else {
                console.log("An unexpected error occurred while deleting a product.", e);
            }
        }
    };

    const handleSearch = async(event) => {
        try{
            const key = event.target.previousSibling.value;
            const trimmedKey = key.trim();

            if(trimmedKey) {
                const encodedKey = encodeURIComponent(trimmedKey);         // Encode the key to handle special characters in the search
                const res = await axios.get(`http://localhost:3005/search/${encodedKey}`,
                    {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
                );
                if(res) {
                    setProducts(await res.data.result);
                }
            } else {
                getProducts();
            }
            console.log("Retrieved search results.");

        } catch(e) {
            if(e.response && e.response.status === 404) {       // Handles 404 Axios error since an Axios error object contains a 'response' property
                console.log("No products were found.");
                setProducts([]);
            } else if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else {
                console.log("An unexpected error occurred while searching for a product.", e);
            }
        }
    }

    return(
        <div className='product-list'>
            <h1>This is the Products page!</h1>

            <input className='search-product-box' type='text' placeholder='Search product'></input>
            <button onClick={handleSearch} className='plSearchProductButton' type='button'>Search</button>

            {
                products.length > 0 ? (
                    <span className='numProductsSpan'>Number of products: {products.length}</span>
                ) : (
                    <></>
                    // <span className='numProductsSpan'>Results found: {products.length}</span>
                )
            }

            {/* Static list headings */}
            <ul>
                {/* <li>S. No.</li> */}
                <li>Name</li>
                <li>Price</li>
                <li>Category</li>
                <li>Company</li>
                <li>Operation</li>
            </ul>

            {                               // Dynamic list
                products.length > 0 ? (
                    products.map((item, index) => (
                        <ul key={item._id}>
                            {/* <li>{index + 1}</li> */}
                            <li>{item.name}</li>
                            <li>{item.price}</li>
                            <li>{item.category}</li>
                            <li>{item.company}</li>
                            <li>
                                <button onClick={()=>handleDelete(item._id)} className='plDeleteProductButton' type='button'>Delete</button>
                                <Link to={'/update/' + item._id}><button className='plUpdateProductButton' type='button'>Update</button></Link>
                            </li>
                        </ul>
                    ))
                ) : (
                    <p>No products found</p>
                )
            }
        </div>
    );
};

export default ProductList;