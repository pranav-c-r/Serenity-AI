import React from 'react';
import './Resources.scss';

const Resources = () => {
  const resources = [
    {
      title: 'Meditation Guide',
      description: 'Learn the basics of meditation and mindfulness practices.',
      category: 'Mindfulness'
    },
    {
      title: 'Stress Management',
      description: 'Techniques and strategies for managing daily stress.',
      category: 'Wellness'
    },
    {
      title: 'Sleep Better',
      description: 'Tips and practices for improving your sleep quality.',
      category: 'Health'
    },
    {
      title: 'Emotional Intelligence',
      description: 'Understanding and managing your emotions effectively.',
      category: 'Personal Growth'
    }
  ];

  return (
    <div className="resources">
      <h1>Resources</h1>
      <div className="resources-grid">
        {resources.map((resource, index) => (
          <div key={index} className="resource-card">
            <div className="resource-category">{resource.category}</div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <button className="read-more">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
