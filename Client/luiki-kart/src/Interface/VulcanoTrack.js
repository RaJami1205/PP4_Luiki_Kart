// components/UrbanTrack.jsx
import React from 'react';
import VulcanoTrackData from '../Assets/matrix_track.json'; 
import '../Styles/VulcanoTrack.css';

const VulcanoTrack = ({ showFullPreview = false }) => {
  const { matrix } = VulcanoTrackData;

  const getCellContent = (value) => {
    switch(value) {
      case 0: // Bloqueado (edificios)
        return <div className="building"></div>;
      case 1: // Carretera
        return <div className="road"></div>;
      case 2: // Punto de inicio
        return <div className="start-point">🏁</div>;
      case 3: // Punto final
        return <div className="finish-point">🏁</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`urban-track-container ${showFullPreview ? 'full-preview' : ''}`}>
      <div className="city-background">
        {showFullPreview && <div className="skyline"></div>}
        <div className="track-grid" style={{ 
          gap: showFullPreview ? '2px' : '1px'
        }}>
          {matrix.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="track-row" style={{ 
            }}>
              {row.map((cell, cellIndex) => (
                <div 
                  key={`cell-${rowIndex}-${cellIndex}`} 
                  className={`track-cell cell-${cell}`}
                >
                  {getCellContent(cell)}
                </div>
              ))}
            </div>
          ))}
        </div>
        {showFullPreview && (
          <div className="city-details">
            <div className="street-light"></div>
            <div className="billboard"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VulcanoTrack;