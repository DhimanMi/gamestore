import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { auth, db } from '../firebase';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';

const DeleteButton = ({ gameId, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid); // Assuming user documents are stored under 'users'
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const roles = docSnap.data().roles;
            setIsAdmin(roles.includes('admin')); // Set isAdmin to true if 'admin' role is present
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      } else {
        setIsAdmin(false); // Reset isAdmin if no user is authenticated
        console.log('User not authenticated!');
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from auth changes
  }, []);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'games', gameId));
      onDelete();
      alert('Игра успешно удалена!');
    } catch (error) {
      console.error('Error deleting game: ', error);
      alert('Произошла ошибка при удалении игры.');
    } finally {
      setShowConfirm(false);
    }
  };

  const handleShowConfirm = () => setShowConfirm(true);
  const handleCloseConfirm = () => setShowConfirm(false);

  return (
    <>
      {isAdmin && (
        <Button variant="danger" onClick={handleShowConfirm}>
          Удалить игру
        </Button>
      )}

      <Modal show={showConfirm} onHide={handleCloseConfirm} dialogClassName="modal-dark">
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          Вы действительно хотите удалить эту игру?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteButton;
