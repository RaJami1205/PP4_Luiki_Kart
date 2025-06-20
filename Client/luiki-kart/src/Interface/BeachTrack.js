import React from 'react';
import BeachTrackData from '../Assets/matrix_track.json';
import '../Styles/BeachTrack.css';

const BeachTrack = ({ showFullPreview = false }) => {
  const { matrix } = BeachTrackData || { matrix: [] };

  const getCellContent = (value) => {
    switch(value) {
      case 0: // Arena
        return <div className="sand"></div>;
      case 1: // Carretera (tablas de surf)
        return <div className="boardwalk">🏄</div>;
      case 2: // Punto de inicio
        return <div className="start-point">🏁</div>;
      case 3: // Punto final
        return <div className="finish-point">🏁</div>;
      case 4: // Agua
        return <div className="water">🌊</div>;
      case 5: // Palmera
        return <div className="palm-tree">🌴</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`beach-track-container ${showFullPreview ? 'full-preview' : ''}`}>
      <div className="beach-background">
        {showFullPreview && <div className="ocean-horizon"></div>}
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
          <div className="beach-details">
            <div className="sun"></div>
            <div className="seagull">🕊️</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeachTrack;