import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { FaParking, FaChargingStation, FaBicycle, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getParkingRecommendation } from '../utils/geminiAI';

const SmartParking = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.7041,
    lng: 77.1025
  });
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const mapStyles = {
    height: "70vh",
    width: "100%"
  };

  // Sample parking data - in real app, this would come from an API
  const sampleParkingSpots = [
    {
      id: 1,
      position: { lat: 28.7041, lng: 77.1025 },
      type: 'regular',
      available: 15,
      total: 50,
      rate: "₹30/hour",
      name: "Connaught Place Parking"
    },
    {
      id: 2,
      position: { lat: 28.6139, lng: 77.2090 },
      type: 'ev',
      available: 5,
      total: 10,
      rate: "₹40/hour",
      evChargers: 3,
      name: "India Gate EV Parking"
    },
    {
      id: 3,
      position: { lat: 28.5355, lng: 77.3910 },
      type: 'bike',
      available: 20,
      total: 30,
      rate: "₹10/hour",
      name: "Noida Sector 18 Bike Parking"
    },
    {
      id: 4,
      position: { lat: 28.4595, lng: 77.0266 },
      type: 'regular',
      available: 30,
      total: 100,
      rate: "₹25/hour",
      name: "Gurgaon Cyber Hub Parking"
    },
    {
      id: 5,
      position: { lat: 28.6692, lng: 77.4538 },
      type: 'ev',
      available: 8,
      total: 15,
      rate: "₹45/hour",
      evChargers: 5,
      name: "Ghaziabad EV Station"
    }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          console.log("Current location:", newLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default Delhi location if geolocation fails
        }
      );
    }

    // In real app, fetch parking data from API
    setParkingSpots(sampleParkingSpots);
  }, []);

  const handleGetDirections = async (spot) => {
    if (destination || spot) {
      const targetSpot = spot || selectedLocation;
      if (!targetSpot) return;

      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: currentLocation,
          destination: targetSpot.position,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );

      // Get AI suggestion
      setLoadingAI(true);
      const suggestion = await getParkingRecommendation(
        currentLocation, 
        targetSpot.name || 'destination',
        targetSpot.type === 'bike' ? 'two-wheeler' : 'car'
      );
      setAiSuggestion(suggestion);
      setLoadingAI(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
          🅿️ Smart Parking Finder
        </h1>

        {/* AI Suggestion Banner */}
        {aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6 mb-6 shadow-xl"
          >
            <div className="flex items-center mb-2">
              <FaRobot className="text-3xl mr-3" />
              <h3 className="text-xl font-bold">AI Parking Assistant</h3>
            </div>
            <p className="text-lg">{loadingAI ? 'Getting AI recommendation...' : aiSuggestion}</p>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <div className="mb-6">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBqenDkMCv8fb9pWBzh4EbD9DvEWQkB6vw'}>
              <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={12}
                center={currentLocation}
                options={{
                  zoomControl: true,
                  streetViewControl: true,
                  mapTypeControl: true,
                  fullscreenControl: true,
                }}
              >
                {/* Current Location Marker */}
                <Marker
                  position={currentLocation}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  }}
                  title="Your Location"
                />

                {/* Parking Spot Markers */}
                {parkingSpots.map(spot => (
                  <Marker
                    key={spot.id}
                    position={spot.position}
                    icon={{
                      url: `http://maps.google.com/mapfiles/ms/icons/${
                        spot.type === 'ev' ? 'green' : 
                        spot.type === 'bike' ? 'yellow' : 
                        'red'
                      }-dot.png`
                    }}
                    onClick={() => {
                      setSelectedLocation(spot);
                      handleGetDirections(spot);
                    }}
                    title={spot.name}
                  />
                ))}

                {/* Directions Renderer */}
                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      polylineOptions: {
                        strokeColor: '#10b981',
                        strokeWeight: 5,
                      },
                    }}
                  />
                )}

                {/* Info Window for selected location */}
                {selectedLocation && (
                  <InfoWindow
                    position={selectedLocation.position}
                    onCloseClick={() => {
                      setSelectedLocation(null);
                      setDirections(null);
                    }}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-bold text-lg mb-2 text-gray-800">
                        {selectedLocation.name || (
                          selectedLocation.type === 'ev' ? 'EV Parking' :
                          selectedLocation.type === 'bike' ? 'Bike Parking' :
                          'Car Parking'
                        )}
                      </h3>
                      <p className={`font-semibold ${getAvailabilityColor(selectedLocation.available, selectedLocation.total)}`}>
                        Available: {selectedLocation.available}/{selectedLocation.total}
                      </p>
                      <p className="text-gray-700">Rate: {selectedLocation.rate}</p>
                      {selectedLocation.type === 'ev' && (
                        <p className="text-green-600 font-semibold">
                          ⚡ EV Chargers: {selectedLocation.evChargers} available
                        </p>
                      )}
                      <button
                        onClick={() => handleGetDirections(selectedLocation)}
                        className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
                      >
                        Get Directions
                      </button>
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
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
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
    </div>
  );
};

export default SmartParking;
