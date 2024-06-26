import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './css/Home.css'; // Import custom styles
import logo from '../Images/logo.png';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Home = () => {
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    fetchPopularGames();
  }, []);

  const fetchPopularGames = async () => {
    try {
      const gamesCollection = await getDocs(collection(db, 'games'));
      const fetchedGames = gamesCollection.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        popularity: doc.data().popularity || Math.floor(Math.random() * 100) + 1
      }));
      const sortedGames = fetchedGames.sort((a, b) => b.popularity - a.popularity).slice(0, 4);
      setPopularGames(sortedGames);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Ошибка при загрузке популярных игр: ', error);
      alert('Произошла ошибка при загрузке популярных игр.');
      setLoading(false); // Set loading to false on error as well
    }
  };

  return (
    <div className="App">
      <header className="header">
        <Container>
          <Row className="align-items-center">
            <Col>
              <img src={logo} alt="Game Store Logo" className="logo" />
              <h1 className="main-title">Game Store</h1>
            </Col>
          </Row>
        </Container>
      </header>

      <main>
        <Container className="main-content">
          <Row>
            <Col>
              <h2 className="section-title">Топ Популярных Игр</h2>
            </Col>
          </Row>
          <Row>
            {loading ? (
              <p>Loading...</p> // Display a loading indicator while fetching data
            ) : (
              popularGames.map(game => (
                <Col key={game.id} sm={12} md={6} lg={3} className="mb-4">
                  <Card className="game-card">
                    <Link to={`/game/${game.id}`}>
                      <div className="image-container">
                        <Card.Img variant="top" src={game.image} className="game-image" />
                      </div>
                    </Link>
                    <Card.Body>
                      <Card.Title>{game.title}</Card.Title>
                      <Card.Text>{game.price} ₽</Card.Text>
                      <a href={`/game/${game.id}`} className="btn btn-primary">Подробнее</a>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </main>

      <footer className="footer">
        <Container>
          <Row>
            <Col className="text-center">
              <p>© 2024 Game Store. Все права защищены.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
