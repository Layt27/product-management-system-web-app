// Imports
import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom';
import axios from 'axios';

// Store backend url in a variable to use for requests
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchKey, setSearchKey] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        setSearchKey('');
        getProducts();
    }, [location]);

    const getProducts = async() => {
        try{
            const res = await axios.get(`${REACT_APP_BACKEND_URL}/products`,
                {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}   // Sends the token to the Authorization header to authenticate requests
            );
            setProducts(res.data.products);

        } catch(e) {
            if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else if(e.response && e.response.status === 404) {
                console.log("There are no products to display.", e.message);
            } else {
                console.log("An unexpected error occurred while retrieving products.", e.message);
                alert("An unexpected error occurred while retrieving products.");
            }
        }
    };

    const handleDelete = async(productId) => {
        try{
            await axios.delete(`${REACT_APP_BACKEND_URL}/product/${productId}`,
                {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
            );
            getProducts();

            setTimeout(() => {
                alert("Product has been deleted.");
            }, 60);
        } catch(e) {
            if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else {
                console.log("An unexpected error occurred while deleting a product.", e.message);
                alert("An unexpected error occurred while deleting a product.");
            }
        }
    };

    const handleSearch = async() => {
        try{
            const key = searchKey;
            const trimmedKey = key.trim();

            if(trimmedKey) {
                const encodedKey = encodeURIComponent(trimmedKey);         // Encode the key to handle special characters in the search
                const res = await axios.get(`${REACT_APP_BACKEND_URL}/search/${encodedKey}`,
                    {headers: {Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`}}
                );
                if(res) {
                    setProducts(await res.data.result);
                }
            } else {
                getProducts();
            }

        } catch(e) {
            if(e.response && e.response.status === 404) {       // Handles 404 Axios error since an Axios error object contains a 'response' property
                setProducts([]);
            } else if(e.response && e.response.status === 401) {
                alert("The token has expired. Please log in again.");
                logout();
            } else {
                console.log("An unexpected error occurred while searching for a product.", e.message);
                alert("An unexpected error occurred while searching for a product.");
            }
        }
    }

    return(
        <div className='product-list'>
            <h1>Product catalog</h1>

            <input className='search-product-box' type='text' placeholder='Search product'
                value={searchKey} onChange={(e) => setSearchKey(e.currentTarget.value)}>
            </input>
            
            <button onClick={handleSearch} className='plSearchProductButton' type='button'>Search</button>

            {
                products.length > 0 ? (
                    <span className='numProductsSpan'>Number of products: {products.length}</span>
                ) : (
                    <></>
                )
            }

            {/* Static list headings */}
            <ul>
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
                            <li>{item.name}</li>
                            <li>{item.price}</li>
                            <li>{item.category}</li>
                            <li>{item.company}</li>
                            <li>
                                <Link to={'/update/' + item._id}><button className='plUpdateProductButton' type='button'>Update</button></Link>
                                <button onClick={()=>handleDelete(item._id)} className='plDeleteProductButton' type='button'>Delete</button>
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