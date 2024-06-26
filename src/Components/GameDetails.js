import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, onAuthStateChanged } from '../firebase';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './css/GameDetails.css'; // Stylesheet for custom styling
import NotFoundPage from '../pages/NotFoundPage'; // Assuming NotFoundPage is defined correctly

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // State to hold current user
  const [loading, setLoading] = useState(true); // State to manage loading state

  const fetchGame = useCallback(async () => {
    try {
      const gameDoc = await getDoc(doc(db, 'games', id));
      if (gameDoc.exists()) {
        setGame({ id: gameDoc.id, ...gameDoc.data() });
      } else {
        console.error('Game not found');
        setGame(null); // Set game to null explicitly if not found
      }
    } catch (error) {
      console.error('Error loading game: ', error);
    } finally {
      setLoading(false); // Mark loading as false when fetch completes
    }
  }, [id]);

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

    fetchGame(); // Fetch the game details

    return () => unsubscribe();
  }, [fetchGame]);

  const fetchCart = async (userId) => {
    const cartDoc = await getDoc(doc(db, 'carts', userId));
    if (cartDoc.exists()) {
      setCart(cartDoc.data().items);
    }
  };

  const handleReadMoreClick = () => {
    setExpanded(true);
  };

  const handleReadLessClick = () => {
    setExpanded(false);
  };

  const handleAddToCart = async (game) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    const updatedCart = [...cart, game];
    setCart(updatedCart);
    await setDoc(doc(db, 'carts', user.uid), { items: updatedCart });
  };

  const isInCart = (gameId) => {
    return cart.some(item => item.id === gameId);
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while fetching game
  }

  if (!game) {
    return <NotFoundPage />; // Display NotFoundPage if game is not found
  }

  return (
    <Container>
      <Row className="my-3">
        <Col md={6}>
          <Card className="game-card">
            <Card.Img variant="top" src={game.image} className="game-card-img-top" />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="game-card">
            <Card.Body className="game-card-body">
              <Card.Title className="game-card-title">{game.title}</Card.Title>
              <Card.Text className="game-card-text">Price: {game.price} ₽</Card.Text>
              <Card.Text className="game-card-text">
                {expanded ? game.description : `${game.description.substring(0, 150)}...`}
                {!expanded ? (
                  <Button variant="link" className="game-read-more" onClick={handleReadMoreClick}>
                    Read more
                  </Button>
                ) : (
                  <Button variant="link" className="game-read-more" onClick={handleReadLessClick}>
                    Read less
                  </Button>
                )}
              </Card.Text>
              <Card.Text className="game-card-text">System Requirements:</Card.Text>
              <Card.Text className="game-card-text">RAM: {game.systemRequirements.ram}</Card.Text>
              <Card.Text className="game-card-text">OS: {game.systemRequirements.os}</Card.Text>
              <Card.Text className="game-card-text">GPU: {game.systemRequirements.gpu}</Card.Text>
              <Card.Text className="game-card-text">Storage: {game.storage} GB</Card.Text>
              <Button
                variant="success"
                className="epic-button"
                onClick={() => handleAddToCart(game)}
                disabled={isInCart(game.id)}
              >
                {isInCart(game.id) ? 'In Cart' : 'Buy'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GameDetails;
