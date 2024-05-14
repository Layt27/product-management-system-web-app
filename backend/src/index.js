// Imports
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Product = require('./models/Product');
const User = require('./models/User');
dotenv.config();

const app = express();
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: 'https://product-management-system-wa.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
}));

const Jwt = require('jsonwebtoken');
const jwtKey = 'pm-s-wa';


// Routes / Endpoints
// ------------------------------------------------------- Products API -------------------------------------------------------
app.get('/products', verifyToken, async(req, res) => {
    try{
        const allProducts = await Product.find();
        if(allProducts.length > 0) {
            console.log("Retrieved all products in the database.");
            res.status(200).json({"products": allProducts});
        } else {
            console.log("There were no products found in the database.");
            res.status(404).json({"result": "No products found"});
        }
    } catch(e) {
        console.log("An unexpected error occurred while retrieving all products.", e.message);
        res.status(500).json({error: "An unexpected error occurred while retrieving all products", message: e.message});
    }
});

app.post('/add-product', verifyToken, async(req, res) => {
    try{
        const {name, price, category, company} = req.body;    // Uses object destructuring to create variables and assign them their respective values from req.body
        const reqBodyKeys = Object.keys(req.body);          // Store all property names passed into the JSON request in a variable

        if((!name || !price || !category || !company) || reqBodyKeys.length !== 4) {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
            return;
        }

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
            res.status(400).json({"result": "Please enter a valid price"});
            return;
        }

        if(trimmedName && trimmedPrice && trimmedCategory && trimmedCompany) {          // Checks if these objects exist and contain truthy values
            // Create a product with the trimmed values for all properties
            const product = new Product(
                {
                    name: trimmedName,
                    price: trimmedPrice,
                    category: trimmedCategory,
                    company: trimmedCompany
                }
            );
            await product.save();
            console.log("A new product has been added to the database.");
            res.status(201).json({product});

        } else {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
            return;
        }
    } catch(e) {
        console.log("An unexpected error occurred while adding a product.", e.message);
        res.status(500).json({error: "An unexpected error occurred while adding a product", message: e.message});
    }
});

app.get('/product/:id', verifyToken, async(req, res)=> {
    try{
        const productId = req.params.id;
        const result = await Product.findById({_id: productId});
        if(result) {
            console.log("Obtained product by product ID.");
            res.status(200).json({result});
        } else {
            console.log("Product not found.");
            res.status(404).json({"result": "Product not found"});
        }
    } catch(e) {
        console.log("An unexpected error occurred while retrieving a product.", e.message);
        res.status(500).json({error: "An unexpected error occurred while retrieving a product", message: e.message});
    }
});

app.put('/product/:id', verifyToken, async(req, res) => {
    try{
        const productId = req.params.id;
        const {name, price, category, company} = req.body;    // Uses object destructuring to create variables and assign them their respective values from req.body
        const reqBodyKeys = Object.keys(req.body)       // Store all property names passed into the JSON request in a variable

        if((!name || !price || !category || !company) || reqBodyKeys.length !== 4) {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
            return;
        }

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
            res.status(400).json({"result": "Please enter a valid price"});
            return;
        }

        if(trimmedName && trimmedPrice && trimmedCategory && trimmedCompany) {          // Checks if these objects exist and contain truthy values
            const result = await Product.findByIdAndUpdate(
                {_id: productId},
                {$set: {name: trimmedName, price: trimmedPrice, category: trimmedCategory, company: trimmedCompany}},
                {new: true}
            );

            if(result) {
                console.log("Product has been updated.");
                res.status(200).json({"updated_product": result});
            } else {
                console.log("Product not found.");
                res.status(404).json({"result": "Product not found"});
            }
        } else {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
            return;
        }
    } catch(e) {
        console.log("An unexpected error occurred while updating a product.", e.message);
        res.status(500).json({error: "An unexpected error occurred while updating a product", message: e.message});
    }
});

app.delete('/product/:id', verifyToken, async(req, res) => {
    try{
        const productId = req.params.id;
        const result = await Product.findByIdAndDelete({_id: productId});
        if(result) {
            console.log("A product has been deleted from the database.");
            res.status(200).json({"deleted_product": result});
        } else {
            console.log("Product not found.");
            res.status(404).json({"result": "Product not found"});
        }
    } catch(e) {
        console.log("An unexpected error occurred while deleting a product.", e.message);
        res.status(500).json({error: "An unexpected error occurred while deleting a product", message: e.message})
    }
});

app.get('/search/:key', verifyToken, async(req, res) => {            // Query Filter / Search API
    try{
        // Escape special regex characters in the search key
        const escapedKey = req.params.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const result = await Product.find({
            '$or': [
                { name: { $regex: escapedKey, $options: 'i' } },        // $options: 'i' used for case-insensitive search
                { price: { $regex: escapedKey, $options: 'i' } },
                { category: { $regex: escapedKey, $options: 'i' } },
                { company: { $regex: escapedKey, $options: 'i' } }
            ]
        });

        if(result.length > 0) {
            console.log("Product(s) found by search.");
            res.status(200).json({result});
        } else {
            console.log("No product(s) found by search.");
            res.status(404).json({"result": "No product(s) found by search"});
        }
    } catch(e) {
        console.log("An unexpected error occurred while searching for a product.", e.message);
        res.status(500).json({error: "An unexpected error occurred while searching for a product", message: e.message})
    }
});

// ------------------------------------------------------- Users API -------------------------------------------------------
app.get('/api/users', async(req, res) => {        // Used for testing purposes and not part of web app
    try{
        const allUsers = await User.find();
        if(allUsers.length > 0) {
            console.log("Retrieved all users in the database.");
            res.status(200).json({"users": allUsers});
        } else {
            console.log("There were no users found in the database.");
            res.status(404).json({"result": "No users found"});
        }  
    } catch(e) {
        console.log("An unexpected error occurred while retrieving all users.", e.message);
        res.status(500).json({error: "An unexpected error occurred while retrieving all users", message: e.message})
    }
});

app.put('/profile/:id', verifyToken, async(req, res) => {
    try{
        const userId = req.params.id;
        const {name, email, mobileNumber} = req.body;
        const reqBodyKeys = Object.keys(req.body)       // Store all property names passed into the JSON request in a variable

        if((!name || !email || !mobileNumber) || reqBodyKeys.length !== 3) {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
            return;
        }

        // Remove whitespaces surrounding other characters
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMobileNumber = mobileNumber.trim();

        // Regular expression to check if the name is valid
        const nameRegex = /^[a-zA-Z\s]+$/;
        if(!nameRegex.test(trimmedName) || trimmedName.split(' ').length !== 2) {
            console.log("Please enter a valid name.");
            res.status(400).json({"result": "Please enter a valid name"});
            return;
        }

        // Regular expression to check if the email is valid
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailRegex.test(trimmedEmail)) {
            console.log("Please enter a valid email address.");
            res.status(400).json({"result": "Please enter a valid email address"});
            return;
        }

        // Regular expression to check if the mobile number is valid
        const mobileNumberRegex = /^\+\d{1,3}\d{3}\d{3}\d{4}$/;
        if(!mobileNumberRegex.test(trimmedMobileNumber)) {
            console.log("Please enter a valid mobile number.");
            res.status(400).json({"result": "Please enter a valid mobile number"});
            return;
        }

        if(trimmedName && trimmedEmail && trimmedMobileNumber) {
            const user = await User.findByIdAndUpdate(
                {_id: userId},
                {$set: {name: trimmedName, email: trimmedEmail, mobileNumber: trimmedMobileNumber}},
                {new: true}
            ).select('-password');
            
            if(user) {
                console.log("User information has been updated.");
                res.status(200).json({"updated_user": user});
            } else {
                console.log("User not found.");
                res.status(404).json({"result": "User not found"});
            }
        } else {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
            return;
        }
    } catch(e) {
        console.log("An unexpected error occurred while updating user info.", e.message);
        res.status(500).json({error: "An unexpected error occurred while updating user info", message: e.message})
    }
});

app.post('/signup', async(req, res) => {
    try{
        const {name, email, mobileNumber, password} = req.body;    // Uses object destructuring to create variables and assign them their respective values from req.body
        const reqBodyKeys = Object.keys(req.body);      // Store all property names passed into the JSON request in a variable

        if((!name || !email || !mobileNumber || !password) || reqBodyKeys.length !== 4) {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
            return;
        }

        // Remove whitespaces surrounding other characters
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMobileNumber = mobileNumber.trim();

        // Regular expression to check if the name contains only letters or spaces
        const nameRegex = /^[a-zA-Z\s]+$/;
        if(!nameRegex.test(trimmedName) || trimmedName.split(' ').length !== 2) {
            console.log("Please enter a valid name.");
            res.status(400).json({"result": "Please enter a valid name"});
            return;
        }

        // Regular expression to check if the email is valid
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailRegex.test(trimmedEmail)) {
            console.log("Please enter a valid email address.");
            res.status(400).json({"result": "Please enter a valid email address"});
            return;
        }

        // Regular expression to check if the mobile number is valid
        const mobileNumberRegex = /^\+\d{1,3}\d{3}\d{3}\d{4}$/;
        if(!mobileNumberRegex.test(trimmedMobileNumber)) {
            console.log("Please enter a valid mobile number.");
            res.status(400).json({"result": "Please enter a valid mobile number"});
            return;
        }

        if(trimmedName && trimmedEmail && trimmedMobileNumber) {
            const user = new User(
                {
                    name: trimmedName,
                    email: trimmedEmail,
                    mobileNumber: trimmedMobileNumber,
                    password
                }
            );
            await user.save();

            // Deletes password from the returned object after being saved in the db
            const userResult = user.toObject();
            delete userResult.password;

            Jwt.sign({userResult}, jwtKey, {expiresIn: '2h'}, (err, token) => {
                if(err) {
                    console.log("An unexpected error occurred while signing the Access Token.", err.message);
                    res.status(500).json({error: "An unexpected error occurred while signing the Access Token", message: err.message})
                }
                console.log("A new user has been added to the database.");
                res.status(201).json({userResult, auth: token});
            });
        } else {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
            return;
        }
    } catch(e) {
        console.log("An unexpected error occurred while signing up.", e.message);
        res.status(500).json({error: "An unexpected error occurred while signing up", message: e.message})
    }
});

app.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body;         // Uses object destructuring to create variables and assign them their respective values from req.body
        const reqBodyKeys = Object.keys(req.body);      // Store all property names passed into the JSON request in a variable

        if(email && password && reqBodyKeys.length === 2) {
            const user = await User.findOne(req.body).select('-password');          // .select('-password') excludes password field from result
            if(user) {
                Jwt.sign({user}, jwtKey, {expiresIn: '2h'}, (err, token) => {
                    if(err) {
                        console.log("An unexpected error occurred while signing the Access Token.", err.message);
                        res.status(500).json({error: "An unexpected error occurred while signing the Access Token", message: err.message})
                    }
                    console.log("User has logged in.");
                    res.status(201).json({user, auth: token});
                });
            } else {
                console.log("Incorrect details provided.");
                res.status(404).json({"result": "Incorrect details provided"});
            }
        } else {
            console.log("Invalid request body provided.");
            res.status(400).json({"result": "Invalid request body provided"});
        }
    } catch(e) {
        console.log("An unexpected error occurred while logging in.", e.message);
        res.status(500).json({error: "An unexpected error occurred while logging in", message: e.message})
    }
});

app.delete('/api/users/:id', async(req, res) => {
    try{
        const userId = req.params.id;
        const result = await User.findByIdAndDelete({_id: userId});
        if(result) {
            console.log("A user has been removed from the database.");
            res.status(200).json({"deleted_user": result});
        } else {
            console.log("User not found.");
            res.status(404).json({"result": "User not found"});
        }
    } catch(e) {
        console.log("An unexpected error occurred while deleting a user.", e.message);
        res.status(500).json({error: "An unexpected error occurred while deleting a user", message: e.message})
    }
});

// Token Verification Middleware Function
function verifyToken(req, res, next) {
    try{
        let token = req.headers['authorization'];
        if(token) {
            token = token.split(' ')[1];
            Jwt.verify(token, jwtKey, (err, valid) => {
                if(err) {
                    console.log("Please provide a valid token.");
                    res.status(401).json({error: "Please provide a valid token", message: err.message});
                } else {
                    console.log("Token has been verified.");
                    next();     // Redirects to the normal routing of the function
                }
            });
        } else {
            console.log("Please provide a token.");
            res.status(403).json({error: "Please provide a token"})
        }
    } catch(e) {
        console.log("An unexpected error occurred while verifying token.", e.message);
        res.status(500).json({error: "An unexpected error occurred while verifying token", message: e.message})
    }
}


// Run Server
const PORT = process.env.PORT || 3004;
const CONNECTION = process.env.CONNECTION;
const start = async() => {
    try{
        await mongoose.connect(CONNECTION);

        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}...`);
        });
    } catch(e) {
        console.log("An unexpected error occurred while attempting to set up the server.", e.message);
        res.status(500).json({error: "An unexpected error occurred while attempting to set up the server", message: e.message})
    }
};

start();