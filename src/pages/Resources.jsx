import React, { useState, useEffect } from 'react';
import './Resources.scss';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Categories for filtering
  const categories = [
    'All',
    'Mindfulness',
    'Wellness',
    'Health',
    'Personal Growth',
    'Videos',
    'Books',
    'Articles'
  ];

  // Fetch resources from multiple APIs
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from multiple sources in parallel
        const [youtubeResults, booksResults, articlesResults] = await Promise.all([
          fetchYouTubeResources(),
          fetchBooksResources(),
          fetchFreeArticles()
        ]);

        // Combine and format all resources
        const allResources = [
          ...youtubeResults,
          ...booksResults,
          ...articlesResults
        ];

        setResources(allResources);
        setFilteredResources(allResources);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching resources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources based on search term and category
  useEffect(() => {
    let results = resources;

    // Apply category filter
    if (selectedCategory !== 'All') {
      results = results.filter(resource => 
        resource.category === selectedCategory || resource.type === selectedCategory
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(resource =>
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.category.toLowerCase().includes(searchLower)
      );
    }

    setFilteredResources(results);
  }, [searchTerm, selectedCategory, resources]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Fetch YouTube videos
  const fetchYouTubeResources = async () => {
    if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
      console.warn('YouTube API key not found');
      return [];
    }

    const searchTerms = [
      'mental health wellness',
      'mindfulness meditation',
      'personal growth development',
      'stress management techniques',
      'emotional intelligence',
      'self care practices'
    ];

    const results = [];
    for (const term of searchTerms) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(term)}&type=video&maxResults=10&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.items) {
          const videos = data.items.map(video => ({
            id: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            category: getCategoryFromTitle(video.snippet.title),
            type: 'Videos',
            link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            image: video.snippet.thumbnails.high.url
          }));
          
          results.push(...videos);
        }
      } catch (err) {
        console.error('Error fetching YouTube videos:', err);
      }
    }
    return results;
  };

  // Fetch books from Google Books API
  const fetchBooksResources = async () => {
    const searchTerms = [
      'mental health wellness',
      'mindfulness meditation',
      'personal growth development'
    ];

    const results = [];
    for (const term of searchTerms) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=10`
        );
        
        if (!response.ok) {
          throw new Error(`Books API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.items) {
          const books = data.items.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            description: book.volumeInfo.description || 'No description available',
            category: getCategoryFromTitle(book.volumeInfo.title),
            type: 'Books',
            link: book.volumeInfo.infoLink,
            image: book.volumeInfo.imageLinks?.thumbnail || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          }));
          
          results.push(...books);
        }
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    }
    return results;
  };

  // Fetch free articles from various sources
  const fetchFreeArticles = async () => {
    // Curated list of free mental health and wellness articles
    const freeArticles = [
      // Mindfulness Articles
      {
        id: 'mindful-1',
        title: 'Getting Started with Mindfulness',
        description: 'A beginner\'s guide to mindfulness meditation and its benefits for mental health.',
        category: 'Mindfulness',
        type: 'Article',
        link: 'https://www.mindful.org/meditation/mindfulness-getting-started/',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 'mindful-2',
        title: 'Mindful Breathing Techniques',
        description: 'Learn effective breathing exercises to reduce stress and anxiety.',
        category: 'Mindfulness',
        type: 'Article',
        link: 'https://www.mindful.org/mindful-breathing/',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      // Wellness Articles
      {
        id: 'psychology-today-1',
        title: 'The Science of Stress Management',
        description: 'Research-backed techniques for managing and reducing stress in daily life.',
        category: 'Wellness',
        type: 'Article',
        link: 'https://www.psychologytoday.com/us/basics/stress',
        image: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 'psychology-today-2',
        title: 'Building Resilience',
        description: 'How to develop mental resilience and bounce back from challenges.',
        category: 'Wellness',
        type: 'Article',
        link: 'https://www.psychologytoday.com/us/basics/resilience',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      // Personal Growth Articles
      {
        id: 'helpguide-1',
        title: 'Improving Emotional Intelligence',
        description: 'Learn how to develop emotional intelligence for better relationships and personal growth.',
        category: 'Personal Growth',
        type: 'Article',
        link: 'https://www.helpguide.org/articles/mental-health/emotional-intelligence-eq.htm',
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 'helpguide-2',
        title: 'Effective Communication Skills',
        description: 'Master the art of communication for better relationships and success.',
        category: 'Personal Growth',
        type: 'Article',
        link: 'https://www.helpguide.org/articles/relationships-communication/effective-communication.htm',
        image: 'https://images.unsplash.com/photo-1548286978-f218023f8d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      // Health Articles
      {
        id: 'healthline-1',
        title: 'Self-Care Strategies for Mental Health',
        description: 'Practical self-care tips and strategies for maintaining good mental health.',
        category: 'Health',
        type: 'Article',
        link: 'https://www.healthline.com/health/mental-health/self-care-strategies',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 'healthline-2',
        title: 'Sleep and Mental Health',
        description: 'Understanding the connection between quality sleep and mental wellbeing.',
        category: 'Health',
        type: 'Article',
        link: 'https://www.healthline.com/health/mental-health/sleep-and-mental-health',
        image: 'https://images.unsplash.com/photo-1548286978-f218023f8d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      // Additional Wellness Articles
      {
        id: 'verywell-1',
        title: 'Building Healthy Habits',
        description: 'Science-backed methods for creating and maintaining healthy habits.',
        category: 'Wellness',
        type: 'Article',
        link: 'https://www.verywellmind.com/how-to-build-healthy-habits-3144747',
        image: 'https://images.unsplash.com/photo-1548286978-f218023f8d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 'verywell-2',
        title: 'Managing Anxiety Naturally',
        description: 'Natural techniques and lifestyle changes to reduce anxiety.',
        category: 'Wellness',
        type: 'Article',
        link: 'https://www.verywellmind.com/natural-anxiety-remedies-2584114',
        image: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ];

    return freeArticles;
  };

  // Helper function to categorize resources based on title
  const getCategoryFromTitle = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('mindfulness') || titleLower.includes('meditation')) {
      return 'Mindfulness';
    } else if (titleLower.includes('wellness') || titleLower.includes('self care')) {
      return 'Wellness';
    } else if (titleLower.includes('health') || titleLower.includes('fitness')) {
      return 'Health';
    } else if (titleLower.includes('growth') || titleLower.includes('development')) {
      return 'Personal Growth';
    }
    return 'Wellness';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video':
        return '🎬';
      case 'Book':
        return '📚';
      case 'Article':
        return '📄';
      case 'Website':
        return '🌐';
      case 'App':
        return '📱';
      default:
        return '🔗';
    }
  };

  const toggleReadMore = (resourceId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Wellness Resources</h1>
        <p>Discover articles, videos, books, and more to support your wellbeing journey</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search resources..."
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
          <p className="loading-text">Gathering wellness resources...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error loading resources: {error}</p>
          <button 
            className="reset-filters"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {filteredResources.length === 0 ? (
            <div className="no-results">
              <p>No resources found matching your criteria.</p>
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
            <div className="resources-grid">
              {filteredResources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div 
                    className="resource-image"
                    style={{ backgroundImage: `url(${resource.image})` }}
                  >
                    <span className="resource-type">{getTypeIcon(resource.type)} {resource.type}</span>
                  </div>
                  <div className="resource-content">
                    <div className="resource-category">{resource.category}</div>
                    <h3>{resource.title}</h3>
                    <p className={`resource-description ${expandedCards.has(resource.id) ? 'expanded' : ''}`}>
                      {expandedCards.has(resource.id)
                        ? resource.description
                        : resource.description.length > 120
                          ? <>
                              {resource.description.slice(0, 120)}... 
                              <span style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}}>Truncated description. Click Read More to expand.</span>
                            </>
                          : resource.description}
                    </p>
                    <div className="resource-footer">
                      <button 
                        className="read-more"
                        onClick={() => toggleReadMore(resource.id)}
                      >
                        {expandedCards.has(resource.id) ? 'Show Less' : 'Read More'}
                      </button>
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        Visit Resource
                      </a>
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

export default Resources;