import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const CustomNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLoggedInStatus = () => {
      const userToken = localStorage.getItem('token');
      setIsLoggedIn(!!userToken);
    };

    const checkAdminLoggedInStatus = () => {
      const adminToken = localStorage.getItem('adminToken');
      setIsAdminLoggedIn(!!adminToken);
    };

    checkUserLoggedInStatus();
    checkAdminLoggedInStatus();
    setLoading(false); // Set loading to false once authentication status is checked
  }, []);

  const handleUserLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('Name');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('User logout successful!');
    navigate('/login');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    toast.success('Admin logout successful!');
    navigate('/admin-login');
  };

  if (loading) return null; // Return null while loading

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Food Rage</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && !isAdminLoggedIn && (
              <>
                <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
                <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                <Nav.Link onClick={handleUserLogout}>Logout</Nav.Link>
              </>
            )}
            {isAdminLoggedIn && (
              <>
                <Nav.Link as={Link} to="/admin-dashboard">Admin Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/food-list">Food List</Nav.Link>
                <Nav.Link as={Link} to="/user-activity">User Activity</Nav.Link>
                <Nav.Link onClick={handleAdminLogout}>Logout</Nav.Link>
              </>
            )}
            {!isLoggedIn && !isAdminLoggedIn && (
              <>
                <Nav.Link as={Link} to="/login">User Login</Nav.Link>
                <Nav.Link as={Link} to="/admin-login">Admin Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
