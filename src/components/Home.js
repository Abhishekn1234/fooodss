// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatchCart } from './Contextreducer';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const dispatch = useDispatchCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const foodResponse = await axios.get('http://localhost:5000/foods');
        setFoods(foodResponse.data);
        
        const categoryResponse = await axios.get('http://localhost:5000/category');
        const categories = categoryResponse.data.map(category => ({
          ...category,
          count: foodResponse.data.filter(food => food.category === category.category).length
        }));
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = () => {
    if (selectedFood) {
      const price = selectedOption ? selectedOption.price : selectedFood.price;
      const totalPrice = price * quantity;
  
      if (selectedOption && price !== 0) {
        const cartItem = {
          name: selectedFood.name,
          quantity: quantity,
          price: totalPrice,
          option: selectedOption
        };
        dispatch({ type: 'ADD_TO_CART', payload: cartItem });
        setModalShow(false);
        navigate('/cart');
      } else {
        console.log("error");
      }
    }
  };

  const handleModalOpen = (food) => {
    setSelectedFood(food);
    setModalShow(true);
    setQuantity(1);
    setSelectedOption(null);
    setTotalPrice(food.price);
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
    const totalPrice = selectedOption ? selectedOption.price * value : selectedFood.price * value;
    setTotalPrice(totalPrice);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option) {
      const totalPrice = option.price * quantity;
      setTotalPrice(totalPrice);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="bg-dark text-light p-4">
      <h1>Categories</h1>
      <Form className="mb-3">
        <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
      </Form>
      <Row>
        {categories.map(category => (
          <Col key={category._id} xs={4} md={2} className="mb-3">
            <div className={`bg-secondary text-light p-3 mb-2 ${selectedCategory === category.category ? 'selected' : ''}`} onClick={() => handleCategorySelect(category.category)}>
              <h2>{category.category} ({category.count})</h2>
            </div>
          </Col>
        ))}
      </Row>

      <Row>
        {foods
          .filter(food => selectedCategory === '' || food.category === selectedCategory)
          .filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase())) // Apply search filter
          .map(food => (
            <Col key={food._id} xs={6} md={4} lg={3} className="mb-4">
              <Card style={{ width: '220px', height: '320px' }}>
                <Card.Img variant="top" src={food.image} className="card-img-top" style={{ height: '160px', objectFit: 'cover' }} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{food.name}</Card.Title>
                  <Button variant="primary" onClick={() => handleModalOpen(food)} className="mt-auto">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedFood && selectedFood.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Price:</strong> ${selectedOption ? selectedOption.price : (selectedFood && selectedFood.price)}</p>
          <p>
            <strong>Quantity:</strong> 
            <input type="number" min="1" value={quantity} onChange={(e) => handleQuantityChange(e.target.value)} required />
          </p>
          {selectedFood && selectedFood.options && selectedFood.options.length > 0 && (
            <p>
              <strong>Options:</strong>
              <select onChange={(e) => handleOptionSelect(JSON.parse(e.target.value))} required={selectedOption ? true : false}>
                <option value="">Select Option</option>
                {selectedFood.options.map((option, index) => (
                  <option key={index} value={JSON.stringify(option)}>{option.name} - ${option.price}</option>
                ))}
              </select>
            </p>
          )}
          <p><strong>Total Price:</strong> ${totalPrice}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
        </Modal.Footer>
      </Modal>
   

      {/* Footer */}
      <footer className="bg-dark text-light text-center p-3 mt-5">
        <div className="container">
          <p>© 2024 Food Rage. All rights reserved.</p>
          <p><Link to="/">Privacy Policy</Link> | <Link to="/">Terms of Service</Link></p>
          <p><Link to="/cart"> My Cart</Link></p>
        </div>
      </footer>
    </div>
  );
}
