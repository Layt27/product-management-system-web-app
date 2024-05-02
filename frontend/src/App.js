// Imports
import './App.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import UpdateProduct from './components/UpdateProduct';
import Profile from './components/Profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';     // BrowserRouter is a wrapper for our app so we can use the routes in our app
import PrivateComponent from './components/PrivateComponent';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />       {/* Includes nav bar HTML from Nav.js file */}
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<ProductList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/update/:id" element={<UpdateProduct />} />
            {/* <Route path="/logout" element={<h1>Logout Component</h1>} /> */}
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Footer />     {/* Includes footer HTML from Footer.js file */}
    </div>
  );
}

export default App;
