import React, { useState, useEffect } from 'react';
import './Guidebook.scss';

// Sample data as fallback
const sampleGuides = [
  {
    id: '1',
    title: 'Understanding Anxiety',
    category: 'Mental Health Conditions',
    description: 'Learn about anxiety disorders, their symptoms, and common triggers. Discover coping mechanisms and when to seek professional help.',
    externalLink: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders'
  },
  {
    id: '2',
    title: 'Cognitive Behavioral Therapy',
    category: 'Therapies & Treatments',
    description: 'Explore how CBT works to change negative thought patterns and behaviors. Understand its effectiveness for various mental health conditions.',
    externalLink: 'https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral'
  },
  {
    id: '3',
    title: 'Mindfulness Meditation',
    category: 'Self-Help Techniques',
    description: 'Master the art of mindfulness meditation. Learn techniques to stay present, reduce stress, and improve mental well-being.',
    externalLink: 'https://www.mindful.org/meditation/mindfulness-getting-started/'
  },
  {
    id: '4',
    title: 'Emotional Intelligence',
    category: 'Emotional Skills',
    description: 'Develop your emotional intelligence to better understand and manage your emotions. Learn how to build stronger relationships.',
    externalLink: 'https://www.helpguide.org/articles/mental-health/emotional-intelligence-eq.htm'
  }
];

const Guidebook = () => {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCards, setExpandedCards] = useState(new Set());

  const categories = [
    'All',
    'Mental Health Conditions',
    'Therapies & Treatments',
    'Self-Help Techniques',
    'Emotional Skills'
  ];

  const generateGuidesWithGemini = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const prompt = `Generate a JSON array of mental health guides. Each guide should have these fields:
    - id: unique string
    - title: string
    - category: one of [${categories.slice(1).join(', ')}]
    - description: string (2-3 sentences)
    - externalLink: string (real URL to a reputable mental health resource)
    
    Generate 8 guides total, with at least 2 guides per category. Make the content helpful and accurate.
    Return ONLY the JSON array, no other text.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch guides');
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Clean and parse the response
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedContent);
  };

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const guidesData = await generateGuidesWithGemini();
        setGuides(guidesData);
        setFilteredGuides(guidesData);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setGuides(sampleGuides);
        setFilteredGuides(sampleGuides);
        setError('Using sample data due to API error. Please check your API key configuration.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  useEffect(() => {
    const searchGuides = () => {
      if (!searchTerm.trim() && selectedCategory === 'All') {
        setFilteredGuides(guides);
        return;
      }

      const searchLower = searchTerm.toLowerCase();
      const results = guides.filter(guide => {
        const matchesSearch = searchTerm.trim() === '' || 
          guide.title.toLowerCase().includes(searchLower) ||
          guide.description.toLowerCase().includes(searchLower) ||
          guide.category.toLowerCase().includes(searchLower);
        
        const matchesCategory = selectedCategory === 'All' || 
          guide.category === selectedCategory;

        return matchesSearch && matchesCategory;
      });

      setFilteredGuides(results);
    };

    const debounceTimer = setTimeout(searchGuides, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, guides]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const toggleReadMore = (guideId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(guideId)) {
        newSet.delete(guideId);
      } else {
        newSet.add(guideId);
      }
      return newSet;
    });
  };

  const handleCardClick = (guide) => {
    if (guide.externalLink) {
      window.open(guide.externalLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="guidebook-page">
      <div className="guidebook-header">
        <h1>Mental Health Guidebook</h1>
        <p>Comprehensive information about mental health conditions, treatments, and self-help techniques</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <p className="loading-text">Gathering mental health guides...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error loading guides: {error}</p>
          <button 
            className="reset-filters"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {filteredGuides.length === 0 ? (
            <div className="no-results">
              <p>No guides found matching your criteria.</p>
              <button 
                className="reset-filters"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="guides-grid">
              {filteredGuides.map(guide => (
                <div 
                  key={guide.id} 
                  className="guide-card"
                  onClick={() => handleCardClick(guide)}
                >
                  <div className="guide-content">
                    <div className="guide-category">{guide.category}</div>
                    <h3>{guide.title}</h3>
                    <p className={`guide-description ${expandedCards.has(guide.id) ? 'expanded' : ''}`}>
                      {guide.description}
                    </p>
                    <div className="guide-footer">
                      <button 
                        className="read-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReadMore(guide.id);
                        }}
                      >
                        {expandedCards.has(guide.id) ? 'Show Less' : 'Read More'}
                      </button>
                      {guide.externalLink && (
                        <a 
                          href={guide.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Learn More →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Guidebook; 