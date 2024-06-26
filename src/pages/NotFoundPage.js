// NotFoundPage.js

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './css/NotFoundPage.css'; // Подключаем файл стилей

const NotFoundPage = () => {
  return (
    <Container fluid className="not-found-container d-flex align-items-center justify-content-center">
      <Row className="justify-content-center"> {/* Центрируем содержимое по горизонтали */}
        <Col md={6} className="text-center">
          <div className="not-found-content">
            <h1 className="not-found-heading">404 Page Not Found</h1>
            <p className="not-found-text">К сожалению вы не большегрудая блондинка</p>
            <Button as={Link} to="/" variant="primary" className="not-found-button">
              Выход
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
