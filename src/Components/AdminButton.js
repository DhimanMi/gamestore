import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import './css/AdminButton.css';

const genres = [
  'Action',
  'Adventure',
  'Role-playing (RPG)',
  'Simulation',
  'Strategy',
  'Sports',
  'Puzzle',
  'Idle',
  'Arcade',
  'Shooter',
  'Racing',
  'Fighting',
  'Survival',
  'Horror',
  'Platformer',
  'NSFW',
];

const ramOptions = ['4GB', '8GB', '16GB', '32GB'];
const osOptions = ['Windows 10', 'Windows 11', 'macOS', 'Linux'];
const gpuOptions = [
  'NVIDIA GeForce GTX 1050',
  'NVIDIA GeForce GTX 1060',
  'NVIDIA GeForce GTX 1070',
  'NVIDIA GeForce GTX 1080',
  'NVIDIA GeForce RTX 2060',
  'NVIDIA GeForce RTX 3060',
  'AMD Radeon RX 570',
  'AMD Radeon RX 580',
  'AMD Radeon RX 590'
];

const AdminButton = ({ onAddGame }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newGame, setNewGame] = useState({
    image: '',
    title: '',
    price: '',
    description: '',
    genres: [],
    systemRequirements: {
      ram: '',
      os: '',
      gpu: ''
    },
    storage: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = doc(collection(db, 'users'), user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const roles = docSnap.data().roles;
            setIsAdmin(roles.includes('admin'));
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      } else {
        setIsAdmin(false);
        console.log('User not authenticated!');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === 'genres') {
      const genre = value;
      setNewGame(prevState => ({
        ...prevState,
        genres: checked ? [...prevState.genres, genre] : prevState.genres.filter(g => g !== genre)
      }));
    } else if (type === 'checkbox') {
      // Handle other checkboxes if needed
    } else if (type === 'text' && ['price', 'storage'].includes(name)) {
      const validatedValue = value.replace(/\D/g, ''); // Only allow digits
      setNewGame(prevState => ({
        ...prevState,
        [name]: validatedValue
      }));
    } else if (['ram', 'os', 'gpu'].includes(name)) {
      setNewGame(prevState => ({
        ...prevState,
        systemRequirements: {
          ...prevState.systemRequirements,
          [name]: value
        }
      }));
    } else {
      setNewGame(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, 'games'), newGame);
      const addedGame = { id: docRef.id, ...newGame };
      onAddGame(addedGame);
      setNewGame({
        image: '',
        title: '',
        price: '',
        description: '',
        genres: [],
        systemRequirements: { ram: '', os: '', gpu: '' },
        storage: ''
      });      
      setShowModal(false);
      alert('Игра успешно добавлена!');
    } catch (error) {
      console.error('Error adding game: ', error);
      alert('Произошла ошибка при добавлении игры.');
    }
  };

  return (
    <div>
      {isAdmin && (
        <Button variant="primary" onClick={handleButtonClick}>
          Добавить игру
        </Button>
      )}

      <Modal show={showModal} onHide={handleCloseModal} variant="dark" dialogClassName="modal-dark">
        <Modal.Header closeButton>
          <Modal.Title>Добавить новую игру</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGameImage">
              <Form.Label>Изображение (ссылка)</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={newGame.image}
                onChange={handleChange}
                placeholder="Введите ссылку на изображение"
              />
            </Form.Group>
            <Form.Group controlId="formGameTitle">
              <Form.Label>Название игры</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newGame.title}
                onChange={handleChange}
                placeholder="Введите название игры"
              />
            </Form.Group>
            <Form.Group controlId="formGamePrice">
              <Form.Label>Цена (в рублях)</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={newGame.price}
                onChange={handleChange}
                placeholder="Введите цену"
              />
            </Form.Group>
            <Form.Group controlId="formGameDescription">
              <Form.Label>Описание игры</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newGame.description}
                onChange={handleChange}
                placeholder="Введите описание игры"
              />
            </Form.Group>
            <Form.Group controlId="formGameGenres">
              <Form.Label>Жанры</Form.Label>
              <div>
                {genres.map(genre => (
                  <Form.Check
                    key={genre}
                    type="checkbox"
                    id={`genre-${genre}`}
                    label={genre}
                    name="genres"
                    value={genre}
                    checked={newGame.genres.includes(genre)}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group controlId="formGameRAM">
              <Form.Label>ОЗУ</Form.Label>
              <Form.Control as="select" name="ram" value={newGame.systemRequirements.ram} onChange={handleChange}>
                <option value="">Выберите ОЗУ</option>
                {ramOptions.map(ram => (
                  <option key={ram} value={ram}>{ram}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formGameOS">
              <Form.Label>Операционная система</Form.Label>
              <Form.Control as="select" name="os" value={newGame.systemRequirements.os} onChange={handleChange}>
                <option value="">Выберите ОС</option>
                {osOptions.map(os => (
                  <option key={os} value={os}>{os}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formGameGPU">
              <Form.Label>Видеокарта</Form.Label>
              <Form.Control as="select" name="gpu" value={newGame.systemRequirements.gpu} onChange={handleChange}>
                <option value="">Выберите видеокарту</option>
                {gpuOptions.map(gpu => (
                  <option key={gpu} value={gpu}>{gpu}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formGameStorage">
              <Form.Label>Хранилище (в GB)</Form.Label>
              <Form.Control
                type="text"
                name="storage"
                value={newGame.storage}
                onChange={handleChange}
                placeholder="Введите требуемый объем хранилища (в GB)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Добавить игру
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminButton;
