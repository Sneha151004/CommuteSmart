  import React, { useEffect, useState } from "react";
  import driver from "../assets/driver.jpg";
  import { useNavigate } from "react-router-dom";

  const GiveRide = () => {
    const navigate = useNavigate();
    const host = "http://localhost:5000";
    
    const [vehicle, setVehicle] = useState("");
    const [seats, setSeats] = useState("");
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [sourceLat, setSourceLat] = useState(null);
    const [sourceLng, setSourceLng] = useState(null);
    const [destinationLat, setDestinationLat] = useState(null);
    const [destinationLng, setDestinationLng] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
// TODO:
     const [suggestions, setSuggestions] = useState([]);

const fetchDestinationSuggestions = async (query) => {
  if (!query) {
    setSuggestions([]);
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    setSuggestions(data.map((place) => ({
      display_name: place.display_name,
      lat: place.lat,
      lon: place.lon,
    })));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
};

const handleDestinationChange = (e) => {
  const input = e.target.value;
  setDestination(input);
  fetchDestinationSuggestions(input);
};

const handleSuggestionClick = (suggestion) => {
  setDestination(suggestion.display_name);
  setDestinationLat(parseFloat(suggestion.lat));
  setDestinationLng(parseFloat(suggestion.lon));
  setSuggestions([]); 
};



    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      setLoadingLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setSource(data.display_name || `${latitude}, ${longitude}`);
            setSourceLat(latitude);
            setSourceLng(longitude);
          } catch (error) {
            console.error("Error fetching location:", error);
            setSource(`${latitude}, ${longitude}`);
            setSourceLat(latitude);
            setSourceLng(longitude);
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get location.");
          setLoadingLocation(false);
        }
      );
    };

      const getDestinationCoordinates = async (address) => {
      if (!address) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (data.length > 0) {
          setDestinationLat(parseFloat(data[0].lat));
          setDestinationLng(parseFloat(data[0].lon));
        } else {
          alert("Destination not found. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching destination coordinates:", error);
      }
    };

    useEffect(() => {
      if (destination) {
        getDestinationCoordinates(destination);
      }
    }, [destination]);



  // TODO:
    const giveRide = async () => {
      const userId = localStorage.getItem("id");
      const authToken = localStorage.getItem("token");
    
      if (!userId) {
        alert("User not logged in.");
        return;
      }
    
      if (!vehicle || !seats || !sourceLat || !sourceLng || !destinationLat || !destinationLng) {
        alert("Please fill all fields correctly.");
        return;
      }
    
      if (!authToken) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }
    
      try {
        const response = await fetch(`${host}/driver/giveride`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({
            vehicle,
            seats,
            source: { lat: sourceLat, lng: sourceLng },
            destination: { lat: destinationLat, lng: destinationLng },
            userId, // Using ID from localStorage instead of user._id
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to offer ride");
        }
    
        const responseData = await response.json();
        navigate("/requests", { state: { driverId: responseData.driverId, vehicle } });
    
      } catch (error) {
        console.error("Error offering ride:", error);
        alert(error.message || "Error offering ride. Please try again.");
      }
    };
    
    

    return (
      <div className="container mx-2 mt-8 px-4">
        <div className="flex justify-center items-center mb-8">
          <form onSubmit={(e) => { e.preventDefault(); giveRide(); }} className="flex-1 mr-8">
            <h2 className="text-3xl font-semibold mb-4 text-custom-green">Give Ride</h2>
            
            <div className="mb-4">
              <label htmlFor="vehicle" className="block text-lg font-semibold mb-2">Vehicle:</label>
              <input
                type="text"
                id="vehicle"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                placeholder="Enter vehicle"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="seats" className="block text-lg font-semibold mb-2">Seats:</label>
              <input
                type="number"
                id="seats"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder="Enter seats"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="source" className="block text-lg font-semibold mb-2">Source:</label>
              <div className="flex">
                <input
                  type="text"
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Enter source"
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  {loadingLocation ? "Loading..." : "Use Current Location"}
                </button>
              </div>
            </div>
            {/* TODO: */}
            <div className="mb-4">
  <label htmlFor="destination" className="block text-lg font-semibold mb-2">Destination:</label>
  <input
    type="text"
    id="destination"
    value={destination}
    onChange={(e) => handleDestinationChange(e)}
    placeholder="Enter destination"
    className="w-full px-4 py-2 border rounded"
    required
  />
  {suggestions.length > 0 && (
    <ul className="border border-gray-300 rounded mt-1 bg-white max-h-40 overflow-auto">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        >
          {suggestion.display_name}
        </li>
      ))}
    </ul>
  )}
</div>

            <button type="submit" className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700">
              Offer Ride
            </button>
          </form>

          <div className="flex-1 hidden md:block">
            <img src={driver} alt="Passenger" className="w-full h-auto" />
          </div>
        </div>
      </div>
    );
  };

export default GiveRide;
