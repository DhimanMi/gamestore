import React from 'react';
import { Navbar, Container, Nav, Button, Image } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import placeholder from '../Images/placeholder.png'; // Импортируем изображение заготовленной аватарки
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart';
import SignUp from '../pages/signup';
import SignIn from '../pages/signin';
import Profile from '../pages/Profile';
import GameDetails from '../Components/GameDetails';
import NotFoundPage from '../pages/NotFoundPage'
import './css/Header.css';

function Header() {
  const [user] = useAuthState(auth);

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <Router>
      <Navbar sticky="top" collapseOnSelect expand="md" className="navbar-custom">
        <Container>
          <div className="navbar-brand-wrapper">
            <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
              Game Store
            </Navbar.Brand>
          </div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom"> Главная </Nav.Link>
              <Nav.Link as={Link} to="/shop" className="nav-link-custom"> Магазин </Nav.Link>
              {user && <Nav.Link as={Link} to="/profile" className="nav-link-custom"> Профиль </Nav.Link>}
              {user && <Nav.Link as={Link} to="/cart" className="nav-link-custom"> Корзина </Nav.Link>}
            </Nav>
            {user ? (
              <Nav className="align-items-center">
                <Image
                  src={user.photoURL || placeholder}
                  alt="User Avatar"
                  className="user-avatar"
                  roundedCircle
                  style={{ width: '30px', height: '30px' }}
                />
                <Nav.Item className="nav-link-custom">{user.displayName || user.email}</Nav.Item>
                <Button variant="outline-light" onClick={handleSignOut} className="nav-button">Выход</Button>
              </Nav>
            ) : (
              <Nav>
                <Button as={Link} to="/signin" variant="outline-light" className="nav-button"> Вход </Button>
                <Button as={Link} to="/signup" variant="success" className="nav-button"> Регистрация </Button>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/cart"
          element={user ? <Cart user={user} /> : <Navigate to="/signin" />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </Router>
  );
}

export default Header;
