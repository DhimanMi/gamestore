import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { db, auth, onAuthStateChanged } from '../firebase';
import { collection, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import AdminButton from '../Components/AdminButton';
import DeleteButton from '../Components/DeleteButton';
import FilterPanel from '../Components/FilterPanel';

import './css/Shop.css';

const Shop = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCart(currentUser.uid);
      } else {
        setUser(null);
        setCart([]);
      }
    });

    fetchGames();

    return () => unsubscribe();
  }, []);

  const fetchGames = async () => {
    try {
      const gamesCollection = await getDocs(collection(db, 'games'));
      const fetchedGames = gamesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(fetchedGames);
      setFilteredGames(fetchedGames);
    } catch (error) {
      console.error('Ошибка при загрузке игр: ', error);
      alert('Произошла ошибка при загрузке игр.');
    }
  };

  const fetchCart = async (userId) => {
    const cartDoc = await getDoc(doc(db, 'carts', userId));
    if (cartDoc.exists()) {
      setCart(cartDoc.data().items);
    }
  };

  const handleDelete = async (gameId) => {
    try {
      await deleteDoc(doc(db, 'games', gameId));
      setGames(prevGames => prevGames.filter(game => game.id !== gameId));
      setFilteredGames(prevGames => prevGames.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Ошибка при удалении игры: ', error);
      alert('Произошла ошибка при удалении игры.');
    }
  };

  const handleAddGame = (newGame) => {
    setGames(prevGames => [...prevGames, newGame]);
    setFilteredGames(prevGames => [...prevGames, newGame]);
  };

  const handleFilterChange = (selectedGenres) => {
    const filtered = games.filter(game => selectedGenres.every(genre => game.genres.includes(genre)));
    setFilteredGames(filtered);
  };

  const handleSortChange = (sortOption) => {
    let sortedGames = [...filteredGames];
    if (sortOption === 'priceAsc') {
      sortedGames.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === 'priceDesc') {
      sortedGames.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    setFilteredGames(sortedGames);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    const searchedGames = games.filter(game => game.title.toLowerCase().includes(term.toLowerCase()));
    setFilteredGames(searchedGames);
  };  

  const handleAddToCart = async (game) => {
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы добавить товары в корзину.');
      return;
    }
    const updatedCart = [...cart, game];
    setCart(updatedCart);
    await setDoc(doc(db, 'carts', user.uid), { items: updatedCart });
  };

  const isInCart = (gameId) => {
    return cart.some(item => item.id === gameId);
  };

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <AdminButton onAddGame={handleAddGame} />
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <FilterPanel
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onSearchChange={handleSearchChange}
          />
        </Col>
      </Row>
      <Row>
        {filteredGames.map(game => (
          <Col key={game.id} sm={12} md={6} lg={4} className="mb-3">
            <Card className="epic-card">
              <div className="epic-img-wrapper">
                <Link to={`/game/${game.id}`}>
                  <Card.Img className="epic-img" variant="top" src={game.image} />
                </Link>
              </div>
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex flex-wrap">
                    {game.genres && game.genres.length > 0 && game.genres.slice(0, 3).map((genre, index) => (
                      <span key={index} className="badge bg-secondary me-1">{genre}</span>
                    ))}
                    {game.genres && game.genres.length > 3 && <span className="badge bg-secondary">...</span>}
                  </div>
                  <DeleteButton gameId={game.id} onDelete={() => handleDelete(game.id)}/>
                </div>
                <Card.Title className="epic-title">
                  <Link to={`/game/${game.id}`}>{game.title}</Link>
                </Card.Title>
                <div className="mt-auto">
                  <Card.Text className="epic-price">
                    Цена: {game.price} ₽
                  </Card.Text>
                  <Button
                    variant="success"
                    className="epic-button"
                    onClick={() => handleAddToCart(game)}
                    disabled={isInCart(game.id)}
                  >
                    {isInCart(game.id) ? 'В корзине' : 'Купить'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Shop;
