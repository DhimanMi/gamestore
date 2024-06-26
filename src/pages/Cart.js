import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { db, auth, onAuthStateChanged } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Импорт Link из react-router-dom
import './css/Cart.css';

const CartItem = ({ item, onRemove }) => (
  <Card className="cart-item mb-3">
    <Row noGutters>
      <Col xs={4} md={3} className="d-flex align-items-center">
        <Link to={`/game/${item.id}`}>
          <img
            alt={item.title}
            src={item.image}
            className="image-placeholder"
          />
        </Link>
      </Col>
      <Col xs={8} md={6} className="d-flex align-items-center">
        <Link to={`/game/${item.id}`} className="description">{item.title}</Link>
      </Col>
      <Col xs={12} md={3} className="d-flex align-items-center justify-content-between">
        <div className="price">{parseInt(item.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
        <Button variant="danger" className="remove-button" onClick={() => onRemove(item.id)}>
          Удалить
        </Button>
      </Col>
    </Row>
  </Card>
);

function Cart() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCart(currentUser.uid);
      } else {
        setUser(null);
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCart = async (userId) => {
    const cartDoc = await getDoc(doc(db, 'carts', userId));
    if (cartDoc.exists()) {
      setItems(cartDoc.data().items);
    }
  };

  const handleRemoveItem = async (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    if (user) {
      await setDoc(doc(db, 'carts', user.uid), { items: updatedItems });
    }
  };

  // Calculate total cost
  const totalCost = items.reduce((acc, item) => acc + parseInt(item.price), 0);

  return (
    <Container className="cart-container">
      <h1 className="cart-header">Корзина</h1>
      <Row>
        {items.map(item => (
          <Col key={item.id} xs={12}>
            <CartItem item={item} onRemove={handleRemoveItem} />
          </Col>
        ))}
      </Row>
      <Card className="total-cost-card mt-4">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div className="total-cost">Общая стоимость: {totalCost.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
          <Button className="pay-button">Оплатить</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Cart;
