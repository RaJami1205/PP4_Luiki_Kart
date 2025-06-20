import React from 'react';
import MountainTrackData from '../Assets/matrix_track.json';
import '../Styles/MountainTrack.css';

const MountainTrack = ({ showFullPreview = false }) => {
  const { matrix } = MountainTrackData || { matrix: [] };

  const getCellContent = (value) => {
    switch(value) {
      case 0: // Roca
        return <div className="rock"></div>;
      case 1: // Camino
        return <div className="path"></div>;
      case 2: // Punto de inicio
        return <div className="start-point">🏁</div>;
      case 3: // Punto final
        return <div className="finish-point">🏁</div>;
      case 4: // Nieve
        return <div className="snow">❄️</div>;
      case 5: // Árbol
        return <div className="tree">🌲</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`mountain-track-container ${showFullPreview ? 'full-preview' : ''}`}>
      <div className="mountain-background">
        {showFullPreview && <div className="mountain-peaks"></div>}
        <div className="track-grid" style={{ 
          gap: showFullPreview ? '2px' : '1px'
        }}>
          {matrix.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="track-row">
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
          <div className="mountain-details">
            <div className="cloud"></div>
            <div className="eagle">🦅</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MountainTrack;