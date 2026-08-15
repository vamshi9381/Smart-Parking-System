import React from 'react';

function ParkingSummary({ totalSpots, occupiedSpots }) {
  const availableSpots = totalSpots - occupiedSpots;
  const occupancyRate = totalSpots > 0 ? ((occupiedSpots / totalSpots) * 100).toFixed(1) : 0;

  return (
    <div className="parking-summary">
      <h2>📊 Parking Status</h2>
      <p>
        <span>Total Spots:</span>
        <span className="summary-value">{totalSpots}</span>
      </p>
      <p>
        <span>Occupied Spots:</span>
        <span className="summary-value">{occupiedSpots}</span>
      </p>
      <p>
        <span>Available Spots:</span>
        <span className="summary-value">{availableSpots}</span>
      </p>
      <p>
        <span>Occupancy Rate:</span>
        <span className="summary-value">{occupancyRate}%</span>
      </p>
    </div>
  );
}

export default ParkingSummary;
