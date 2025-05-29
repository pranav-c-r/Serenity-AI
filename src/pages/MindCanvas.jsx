import React, { useState } from 'react';
import './MindCanvas.scss';

const MindCanvas = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // TODO: Implement actual image generation API call
      // This is a placeholder for the API integration
      const response = await fetch('YOUR_IMAGE_GENERATION_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mind-canvas">
      <div className="page-header">
        <h1>Mind Canvas</h1>
        <p>Transform your thoughts into visual art</p>
      </div>

      <div className="canvas-container">
        <div className="prompt-section">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create..."
            className="prompt-input"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="generate-button"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="result-section">
          {generatedImage ? (
            <div className="generated-image">
              <img src={generatedImage} alt="Generated art" />
              <div className="image-actions">
                <button className="action-button">Save</button>
                <button className="action-button">Share</button>
                <button className="action-button">Regenerate</button>
              </div>
            </div>
          ) : (
            <div className="placeholder">
              <div className="placeholder-icon">🎨</div>
              <p>Your generated image will appear here</p>
            </div>
          )}
        </div>

        <div className="prompt-suggestions">
          <h3>Prompt Suggestions</h3>
          <div className="suggestions-grid">
            <button onClick={() => setPrompt("A peaceful mountain landscape at sunset")}>
              Peaceful mountain landscape
            </button>
            <button onClick={() => setPrompt("A magical forest with glowing mushrooms")}>
              Magical forest
            </button>
            <button onClick={() => setPrompt("A serene ocean scene with dolphins")}>
              Ocean scene
            </button>
            <button onClick={() => setPrompt("A cozy reading nook with warm lighting")}>
              Cozy reading nook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindCanvas; 