import React, { useState } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './css/FilterPanel.css';

const genres = [
  'Action', 'Adventure', 'Role-playing (RPG)', 'Simulation', 'Strategy',
  'Sports', 'Puzzle', 'Idle', 'Arcade', 'Shooter', 'Racing', 'Fighting',
  'Survival', 'Horror', 'Platformer', 'NSFW',
];

const FilterPanel = ({ onFilterChange, onSortChange, onSearchChange }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Initial state set to false

  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSortOption('');
    setSearchTerm('');
    onFilterChange([]);
    onSortChange('');
    onSearchChange('');
  };

  const handleGenreChange = (genre) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updatedGenres);
    onFilterChange(updatedGenres);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    onSortChange(option);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchChange(term);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="filter-panel epic-games">
      <div className="filter-content">
        <div className="search-panel">
          <Form.Group controlId="formSearch">
            <div className="search-input-container">
              <Form.Control
                type="text"
                className="search-input"
                placeholder="Поиск игры по названию"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm &&
                <FontAwesomeIcon
                  icon={faTimes}
                  className="clear-search-icon"
                  onClick={clearSearchTerm}
                />
              }
            </div>
          </Form.Group>
        </div>
        <Accordion className={`accordion-container ${isPanelOpen ? 'panel-expanded' : 'panel-collapsed'}`}>
          <Accordion.Item eventKey="0">
            <Accordion.Header onClick={togglePanel} className="accordion-header">
              <h5 className="accordion-title">Фильтры</h5>
            </Accordion.Header>
            <Accordion.Body className={isPanelOpen ? 'show' : 'hide'}>
              <div className="genres-container">
                {genres.map(genre => (
                  <Form.Check
                    key={genre}
                    type="checkbox"
                    id={`genre-${genre}`}
                    label={genre}
                    checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="form-check epic-games-checkbox"
                    inline
                  />
                ))}
              </div>
              <Form.Group controlId="formSort">
                <Form.Select
                  className="sort-select epic-games-select"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="">Сортировка</option>
                  <option value="priceAsc">Цена: по возрастанию</option>
                  <option value="priceDesc">Цена: по убыванию</option>
                </Form.Select>
              </Form.Group>
              <Button className="reset-button epic-games-button" onClick={handleResetFilters}>
                Сбросить фильтры
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

export default FilterPanel;
