function ActionModal({ isOpen, onClose, spotData, onVacate, onCancel }) {
  if (!isOpen || !spotData) return null;

  const handleVacate = () => {
    onVacate();
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  const formatEntryTime = (entryTime) => {
    if (!entryTime) {
      return 'Date not available';
    }
    
    try {
      let date;
      if (entryTime instanceof Date) {
        date = entryTime;
      } else {
        date = new Date(entryTime);
      }
      
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }

      return date.toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  return (
    <>
      <div className="action-modal-overlay" onClick={onClose} />
      <div className="action-modal">
        <div className="action-modal-header">
          <h3>🚗 {spotData.id}</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="action-modal-content">
          <div className="vehicle-info">
            <div className="vehicle-icon">
              {spotData.tipoVeiculo === 'MOTO' ? '🏍️' : '🚗'}
            </div>
            <div className="vehicle-details">
              <p><strong>Plate:</strong> {spotData.vehiclePlate}</p>
              <p><strong>Type:</strong> {spotData.tipoVeiculo}</p>
              <p><strong>Entry:</strong> {formatEntryTime(spotData.entryTime)}</p>
            </div>
          </div>
          
          <div className="action-question">
            <p>What would you like to do with this vehicle?</p>
          </div>
        </div>
        
        <div className="action-modal-buttons">
          <button 
            className="action-btn vacate-btn"
            onClick={handleVacate}
            >
            🚪 Register Exit
            <span className="btn-description">Ends stay and calculates the fee</span>
          </button>
          
          <button 
            className="action-btn cancel-btn"
            onClick={handleCancel}
          >
            ❌ Cancel Entry
            <span className="btn-description">Removes the record without charging</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default ActionModal;
