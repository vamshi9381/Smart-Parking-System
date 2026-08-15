import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import ParkingSpot from './ParkingSpot';
import ParkingSummary from './ParkingSummary';
import { fetchSpotsFromAPI, occupySpotInAPI, vacateSpotInAPI, cancelEntryInAPI } from '../../services/api/Api';
import VehicleEntryForm from '../forms/VehicleEntryForm';
import ActionModal from '../ActionModal';

function ParkingLot() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedSpotData, setSelectedSpotData] = useState(null);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiSpots = await fetchSpotsFromAPI(); 
        setSpots(apiSpots); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSpots();
  }, []);

  const handleSpotClick = async (spotId) => {
    const spotToUpdate = spots.find(spot => spot.id === spotId);
    if (!spotToUpdate) return;

    if (spotToUpdate.isOccupied) {
      setSelectedSpotData(spotToUpdate);
      setShowActionModal(true);
    } else {
      setSelectedSpotId(spotId);
      setShowVehicleForm(true);
    }
  };

  const handleVacateSpot = async () => {
    if (!selectedSpotData) return;
    
    try {
      const plateToVacate = selectedSpotData.backendPlateId || selectedSpotData.vehiclePlate;
      const apiResponse = await vacateSpotInAPI(plateToVacate);
      
      setSpots(currentSpots =>
        currentSpots.map(s => 
          s.id === selectedSpotData.id 
            ? { ...s, isOccupied: false, vehiclePlate: null, entryTime: null, backendPlateId: null } 
            : s
        )
      );
      
      console.log(`Spot ${selectedSpotData.id} vacated. Details:`, apiResponse);

      toast.success(`✅ Spot ${selectedSpotData.id} vacated successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error vacating spot:", err);

      toast.error(`❌ Error: ${err.message || "Could not vacate the spot."}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleCancelEntry = async () => {
    if (!selectedSpotData) return;
    
    try {
      const plateToCancel = selectedSpotData.backendPlateId || selectedSpotData.vehiclePlate;
      await cancelEntryInAPI(plateToCancel);
      
      setSpots(currentSpots =>
        currentSpots.map(s => 
          s.id === selectedSpotData.id 
            ? { ...s, isOccupied: false, vehiclePlate: null, entryTime: null, backendPlateId: null } 
            : s
        )
      );

      toast.success(`✅ Entry for ${selectedSpotData.id} cancelled successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error cancelling entry:", err);

      toast.error(`❌ Error: ${err.message || "Could not cancel the entry."}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleVehicleEntrySubmit = async (vehicleData) => {
    if (!selectedSpotId) return;
    try {
      const updatedSpotDataFromAPI = await occupySpotInAPI(selectedSpotId, vehicleData);
      
      setSpots(currentSpots =>
        currentSpots.map(s => (s.id === selectedSpotId ? { ...s, ...updatedSpotDataFromAPI } : s))
      );
      setShowVehicleForm(false);
      setSelectedSpotId(null);
    } catch (err) {
      console.error("Error registering vehicle entry:", err);

      toast.error(`❌ Error registering entry: ${err.message || "Failed to communicate with the server."}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleCloseVehicleForm = () => {
    setShowVehicleForm(false);
    setSelectedSpotId(null);
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setSelectedSpotData(null);
  };

  const occupiedSpotsCount = spots.filter(spot => spot.isOccupied).length;
  const totalSpotsCount = spots.length;

  if (loading) return <p>Loading spots...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <ParkingSummary totalSpots={totalSpotsCount} occupiedSpots={occupiedSpotsCount} />
      <div className="parking-lot-container">
        {spots.map(spot => (
          <ParkingSpot
            key={spot.id}
            spotData={spot}
            onSpotClick={() => handleSpotClick(spot.id)} 
          />
        ))}
      </div>

      {showVehicleForm && selectedSpotId && (
        <VehicleEntryForm
          spotId={selectedSpotId}
          onSubmit={handleVehicleEntrySubmit}
          onCancel={handleCloseVehicleForm}
        />
      )}

      <ActionModal
        isOpen={showActionModal}
        onClose={handleCloseActionModal}
        spotData={selectedSpotData}
        onVacate={handleVacateSpot}
        onCancel={handleCancelEntry}
      />
    </div>
  );
}

export default ParkingLot;