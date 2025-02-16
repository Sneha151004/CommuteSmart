import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { FaParking, FaChargingStation, FaBicycle } from 'react-icons/fa';

const SmartParking = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 20.5937, // Default to India coordinates
    lng: 78.9629
  });

  const mapStyles = {
    height: "70vh",
    width: "100%"
  };

  // Sample parking data - in real app, this would come from an API
  const sampleParkingSpots = [
    {
      id: 1,
      position: { lat: 20.5937, lng: 78.9629 },
      type: 'regular',
      available: 15,
      total: 50,
      rate: "₹30/hour"
    },
    {
      id: 2,
      position: { lat: 20.6037, lng: 78.9729 },
      type: 'ev',
      available: 5,
      total: 10,
      rate: "₹40/hour",
      evChargers: 3
    },
    {
      id: 3,
      position: { lat: 20.5837, lng: 78.9529 },
      type: 'bike',
      available: 20,
      total: 30,
      rate: "₹10/hour"
    }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }

    // In real app, fetch parking data from API
    setParkingSpots(sampleParkingSpots);
  }, []);

  const getMarkerIcon = (type) => {
    switch (type) {
      case 'ev':
        return '🔌';
      case 'bike':
        return '🚲';
      default:
        return '🅿️';
    }
  };

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Smart Parking Finder
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="mb-6">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={13}
              center={currentLocation}
            >
              {/* Current Location Marker */}
              <Marker
                position={currentLocation}
                icon="📍"
              />

              {/* Parking Spot Markers */}
              {parkingSpots.map(spot => (
                <Marker
                  key={spot.id}
                  position={spot.position}
                  icon={getMarkerIcon(spot.type)}
                  onClick={() => setSelectedLocation(spot)}
                />
              ))}

              {/* Info Window for selected location */}
              {selectedLocation && (
                <InfoWindow
                  position={selectedLocation.position}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold mb-2">
                      {selectedLocation.type === 'ev' ? 'EV Parking' :
                        selectedLocation.type === 'bike' ? 'Bike Parking' :
                          'Car Parking'}
                    </h3>
                    <p className={getAvailabilityColor(selectedLocation.available, selectedLocation.total)}>
                      Available: {selectedLocation.available}/{selectedLocation.total}
                    </p>
                    <p>Rate: {selectedLocation.rate}</p>
                    {selectedLocation.type === 'ev' && (
                      <p>EV Chargers: {selectedLocation.evChargers} available</p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaParking className="text-blue-600 mr-2" />
              <span>Car Parking</span>
            </div>
            <span className="text-green-600">
              {parkingSpots.filter(spot => spot.type === 'regular').reduce((acc, spot) => acc + spot.available, 0)} available
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaChargingStation className="text-green-600 mr-2" />
              <span>EV Charging</span>
            </div>
            <span className="text-green-600">
              {parkingSpots.filter(spot => spot.type === 'ev').reduce((acc, spot) => acc + spot.available, 0)} available
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaBicycle className="text-orange-600 mr-2" />
              <span>Bike Parking</span>
            </div>
            <span className="text-green-600">
              {parkingSpots.filter(spot => spot.type === 'bike').reduce((acc, spot) => acc + spot.available, 0)} available
            </span>
          </div>
        </div>
      </div>

      {/* Legend and Tips */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Parking Tips</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Green markers indicate high availability</li>
          <li>Yellow markers indicate moderate availability</li>
          <li>Red markers indicate low availability</li>
          <li>Click on markers to see detailed information</li>
          <li>EV charging stations are marked with ⚡</li>
        </ul>
      </div>
    </div>
  );
};

export default SmartParking;
