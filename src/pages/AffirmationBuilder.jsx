import React, { useState, useEffect } from 'react';
import { FaHeart, FaStar, FaLightbulb, FaSun, FaMoon } from 'react-icons/fa';
import './AffirmationBuilder.scss';

const AffirmationBuilder = () => {
  const [affirmations, setAffirmations] = useState([]);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const categories = [
    { id: 'all', name: 'All', icon: FaStar },
    { id: 'self-love', name: 'Self-Love', icon: FaHeart },
    { id: 'growth', name: 'Growth', icon: FaLightbulb },
    { id: 'morning', name: 'Morning', icon: FaSun },
    { id: 'evening', name: 'Evening', icon: FaMoon }
  ];

  useEffect(() => {
    const savedAffirmations = localStorage.getItem('affirmations');
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedAffirmations) {
      setAffirmations(JSON.parse(savedAffirmations));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('affirmations', JSON.stringify(affirmations));
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [affirmations, favorites]);

  const handleAddAffirmation = (e) => {
    e.preventDefault();
    if (newAffirmation.trim()) {
      const affirmation = {
        id: Date.now(),
        text: newAffirmation,
        category: selectedCategory,
        createdAt: new Date().toISOString()
      };
      setAffirmations([...affirmations, affirmation]);
      setNewAffirmation('');
    }
  };

  const handleDeleteAffirmation = (id) => {
    setAffirmations(affirmations.filter(aff => aff.id !== id));
    setFavorites(favorites.filter(fav => fav !== id));
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredAffirmations = affirmations.filter(aff => 
    selectedCategory === 'all' || aff.category === selectedCategory
  );

  const CategoryIcon = categories.find(cat => cat.id === selectedCategory)?.icon;

  return (
    <div className={`affirmation-builder ${isDarkMode ? 'dark' : 'light'}`}>
      <h1>Positive Affirmation Builder</h1>
      <p>Create and collect your daily affirmations</p>

      <div className="builder-box">
        <div className="category-selector">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="category-icon" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleAddAffirmation} className="add-form">
          <input
            type="text"
            value={newAffirmation}
            onChange={(e) => setNewAffirmation(e.target.value)}
            placeholder="Write your affirmation..."
            className="affirmation-input"
          />
          <button type="submit" className="add-button">
            Add Affirmation
          </button>
        </form>

        <div className="affirmations-list">
          {filteredAffirmations.length > 0 ? (
            filteredAffirmations.map(affirmation => (
              <div
                key={affirmation.id}
                className={`affirmation-card ${favorites.includes(affirmation.id) ? 'favorite' : ''}`}
              >
                <div className="affirmation-content">
                  <p className="affirmation-text">{affirmation.text}</p>
                  <div className="affirmation-actions">
                    <button
                      className="favorite-button"
                      onClick={() => toggleFavorite(affirmation.id)}
                    >
                      <FaHeart className={favorites.includes(affirmation.id) ? 'active' : ''} />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteAffirmation(affirmation.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="affirmation-meta">
                  <span className="category">
                    {categories.find(cat => cat.id === affirmation.category)?.name}
                  </span>
                  <span className="date">
                    {new Date(affirmation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <CategoryIcon className="empty-icon" />
              <p>No affirmations in this category yet.</p>
              <p>Start by adding your first affirmation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffirmationBuilder; 