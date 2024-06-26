import React, { Component } from 'react';
import { Container, Row, Col, Image, Button, Modal, Form } from 'react-bootstrap';
import { getAuth, updateProfile, sendPasswordResetEmail, deleteUser, updateEmail } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import placeholder from '../Images/placeholder.png';
import './css/Profile.css';

const auth = getAuth();
const storage = getStorage();

class Profile extends Component {
    state = {
        showModal: false,
        newEmail: '',
        newName: '',
        newPhoto: null,
    };

    handlePasswordReset = () => {
        const { user } = this.props;
        if (user) {
            sendPasswordResetEmail(auth, user.email)
                .then(() => {
                    alert('Письмо для сброса пароля отправлено на вашу почту.');
                })
                .catch(error => {
                    console.error('Ошибка при отправке письма для сброса пароля:', error);
                    alert('Ошибка при отправке письма для сброса пароля.');
                });
        }
    };

    handleDeleteAccount = () => {
        this.setState({ showModal: true });
    };

    confirmDeleteAccount = () => {
        const { user } = this.props;
        if (user) {
            deleteUser(auth.currentUser)
                .then(() => {
                    alert('Ваш аккаунт успешно удален.');
                })
                .catch(error => {
                    console.error('Ошибка при удалении аккаунта:', error);
                    alert('Ошибка при удалении аккаунта.');
                });
        }
        this.setState({ showModal: false });
    };

    cancelDeleteAccount = () => {
        this.setState({ showModal: false });
    };

    handleChangeEmail = () => {
        const { user } = this.props;
        const { newEmail } = this.state;

        if (user && newEmail.trim() !== '') {
            updateEmail(auth.currentUser, newEmail)
                .then(() => {
                    alert('Ваша почта успешно изменена.');
                    user.email = newEmail;
                    this.setState({ newEmail: '' });
                })
                .catch(error => {
                    console.error('Ошибка при изменении почты:', error);
                    alert(`Ошибка при изменении почты: ${error.message}`);
                });
        } else {
            alert('Введите новую почту.');
        }
    };

    handleChangeName = () => {
        const { user } = this.props;
        const { newName } = this.state;

        if (user && newName.trim() !== '') {
            updateProfile(auth.currentUser, { displayName: newName })
                .then(() => {
                    alert('Ваше имя успешно изменено.');
                    user.displayName = newName;
                    this.setState({ newName: '' });
                })
                .catch(error => {
                    console.error('Ошибка при изменении имени:', error);
                    alert(`Ошибка при изменении имени: ${error.message}`);
                });
        } else {
            alert('Введите новое имя.');
        }
    };

    handlePhotoChange = (event) => {
        if (event.target.files[0]) {
            this.setState({ newPhoto: event.target.files[0] });
        }
    };

    handleUploadPhoto = () => {
        const { user } = this.props;
        const { newPhoto } = this.state;

        if (user && newPhoto) {
            const storageRef = ref(storage, `profile_pictures/${user.uid}`);
            uploadBytes(storageRef, newPhoto).then(snapshot => {
                getDownloadURL(snapshot.ref).then(downloadURL => {
                    updateProfile(auth.currentUser, { photoURL: downloadURL })
                        .then(() => {
                            alert('Фото профиля успешно изменено.');
                            user.photoURL = downloadURL;
                            this.setState({ newPhoto: null });
                        })
                        .catch(error => {
                            console.error('Ошибка при изменении фото профиля:', error);
                            alert(`Ошибка при изменении фото профиля: ${error.message}`);
                        });
                });
            }).catch(error => {
                console.error('Ошибка при загрузке фото:', error);
                alert(`Ошибка при загрузке фото: ${error.message}`);
            });
        } else {
            alert('Выберите новое фото.');
        }
    };

    render() {
        const { user } = this.props;
        const { showModal, newEmail, newName, newPhoto } = this.state;
        const userName = user ? (user.displayName || user.email || "Имя пользователя") : "Имя пользователя";
        const photoURL = user ? (user.photoURL || placeholder) : placeholder;

        return (
            <Container>
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="text-center user-profile">
                        <Image
                            src={photoURL}
                            alt="User Avatar"
                            className="profile-avatar"
                            roundedCircle
                        />
                        <h2>{userName}</h2>
                        {user && <p>{user.email}</p>}
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="text-center user-profile">
                        <Button variant="primary" onClick={this.handlePasswordReset}>Сбросить пароль</Button>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="text-center user-profile">
                        <Button variant="danger" onClick={this.handleDeleteAccount}>Удалить аккаунт</Button>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="text-center user-profile">
                        <Form.Group>
                            <Form.Control
                                type="email"
                                placeholder="Новая почта"
                                value={newEmail}
                                onChange={e => this.setState({ newEmail: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="info" onClick={this.handleChangeEmail}>Изменить почту</Button>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="text-center user-profile">
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Новое имя"
                                value={newName}
                                onChange={e => this.setState({ newName: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="info" onClick={this.handleChangeName}>Изменить имя</Button>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={6} className="text-center user-profile">
                        <Form.Group>
                            <Form.Control
                                type="file"
                                onChange={this.handlePhotoChange}
                            />
                        </Form.Group>
                        <Button variant="info" onClick={this.handleUploadPhoto}>Изменить фото профиля</Button>
                    </Col>
                </Row>
                <Modal show={showModal} onHide={this.cancelDeleteAccount} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Подтвердите удаление аккаунта</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Вы уверены, что хотите удалить свой аккаунт?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.cancelDeleteAccount}>Отмена</Button>
                        <Button variant="danger" onClick={this.confirmDeleteAccount}>Удалить</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

export default Profile;
