import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        let userEmail = localStorage.getItem('userEmail');
        let Name = localStorage.getItem('Name');
        if (!userEmail || !Name) {
          console.error('User email or Name not found in localStorage');
          return;
        }

        const response = await axios.get('http://localhost:5000/orders');
        const userOrders = response.data.filter(order => order.email === userEmail && order.Name === Name);

        // Calculate total price if needed
        const totalPrice = userOrders.reduce((acc, order) => acc + totalOrderPrice(order.cartItems), 0);

        setOrders(userOrders);
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders();
  }, []);

  const totalOrderPrice = (cartItems) => {
    return cartItems.reduce((acc, item) => {
      const itemPrice = item.option ? item.option.price : item.price;
      return acc + itemPrice * item.quantity;
    }, 0);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));

      // Recalculate total price after deleting the order
      const totalPriceAfterDelete = orders.filter(order => order._id !== orderId).reduce((acc, order) => acc + totalOrderPrice(order.cartItems), 0);
      setTotalPrice(totalPriceAfterDelete);

      alert('Order deleted successfully!');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {orders.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.cartItems.map(item => (
                      <div key={item._id}>
                        {item.name}
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.cartItems.map(item => (
                      <div key={item._id}>
                        ${item.option ? item.option.price * item.quantity : item.price * item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.cartItems.map(item => (
                      <div key={item._id}>
                        {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>${totalOrderPrice(order.cartItems)}</td>
                  <td>
                    <Button variant="info" onClick={() => handleViewDetails(order)}>View Details</Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteOrder(order._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h2>Total Price of All Orders: ${totalPrice}</h2>
        </>
      ) : (
        <p>No orders placed yet.</p>
      )}

      {/* Modal for displaying order details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Order ID:</strong> {selectedOrder && selectedOrder._id}</p>
          <p><strong>Product Name:</strong> {selectedOrder && selectedOrder.cartItems[0].name}</p>
          <p><strong>Price:</strong> ${selectedOrder && totalOrderPrice(selectedOrder.cartItems)}</p>
          <p><strong>Quantity:</strong> {selectedOrder && selectedOrder.cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
