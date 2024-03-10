import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

export default function UserActivity() {
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    async function fetchUserOrders() {
      try {
        const response = await axios.get('http://localhost:5000/orders');
        setUserOrders(response.data);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    }

    fetchUserOrders();
  }, []);

  return (
    <div>
      <h1>User Activity</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {userOrders.map(order => (
            <tr key={order._id}>
              <td>{order.Name}</td>
              <td>{order.email}</td>
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
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
