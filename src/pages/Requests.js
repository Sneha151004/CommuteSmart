// import React, { useContext, useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import GeneralContext from "../context/GeneralContext";
// import toast from "react-hot-toast";
// import {
//   useJsApiLoader,
//   GoogleMap,
//   Marker,
//   Autocomplete,
//   DirectionsService,
//   DirectionsRenderer,
// } from "@react-google-maps/api";

// const center = { lat: 12.9716, lng: 77.5946 };

// const Requests = () => {
//   const navigate = useNavigate();
//   const context = useContext(GeneralContext);
//   const { setLeaderboardData } = context;
//   const location = useLocation();
//   const host = "http://localhost:5000";
//   const [rideRequests, setRideRequests] = useState([]);
//   const [error, setError] = useState("");
//   const [map, setMap] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [distance, setDistance] = useState("");
//   const [duration, setDuration] = useState("");
//   const vehicle = location.state?.vehicle;
//   console.log(vehicle);


//   const calcCarbon = async (vehicle, distance) => {
//     const url = "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_type";
//     const options = {
//       method: "POST",
//       headers: {
//         "content-type": "application/x-www-form-urlencoded",
//         Authorization: `Bearer YOUR_BEARER_TOKEN_HERE`, // Replace with your actual bearer token
//         "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY_HERE", // Replace with your actual RapidAPI key
//         "X-RapidAPI-Host": "YOUR_RAPIDAPI_HOST_HERE", // Replace with the correct API host
//       },
//       body: new URLSearchParams({
//         vehicle_type: vehicle,
//         distance_value: distance,
//         distance_unit: "km",
//       }),
//     };

//     try {
//       const response = await fetch(url, options);
//       const resultText = await response.text();
//       const responseData = JSON.parse(resultText);
//       const co2eGrams = responseData.data.co2e_gm;
//       console.log(co2eGrams);
//       const avgEmission = co2eGrams / distance;
//       if (avgEmission <= 100) {
//         const temp = await setLeaderboardData(
//           localStorage.getItem("name"),
//           100
//         );
//         const updatedData = await temp.find(
//           (entry) => entry.user === localStorage.getItem("id")
//         );
//         const userCoins = updatedData.coins;
//         localStorage.setItem("coins", userCoins);
//         toast.success(
//           `Earned 100 EcoCoins!, ${co2eGrams} grams carbon emitted`
//         );
//       } else if (avgEmission > 100 && avgEmission < 160) {
//         const temp = await setLeaderboardData(localStorage.getItem("name"), 50);
//         const updatedData = await temp.find(
//           (entry) => entry.user === localStorage.getItem("id")
//         );
//         const userCoins = updatedData.coins;
//         localStorage.setItem("coins", userCoins);
//         toast.success(`Earned 50 EcoCoins!, ${co2eGrams} grams carbon emitted`);
//       } else if (avgEmission >= 160 && avgEmission <= 255) {
//         const temp = await setLeaderboardData(localStorage.getItem("name"), 20);
//         const updatedData = await temp.find(
//           (entry) => entry.user === localStorage.getItem("id")
//         );
//         const userCoins = updatedData.coins;
//         localStorage.setItem("coins", userCoins);
//         toast.success(`Earned 20 EcoCoins!, ${co2eGrams} grams carbon emitted`);
//       } else {
//         const temp = await setLeaderboardData(
//           localStorage.getItem("name"),
//           -10
//         );
//         const updatedData = await temp.find(
//           (entry) => entry.user === localStorage.getItem("id")
//         );
//         const userCoins = updatedData.coins;
//         localStorage.setItem("coins", userCoins);
//         toast.success(`Earned 10 EcoCoins!, ${co2eGrams} grams carbon emitted`);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyA733VdZHskBkFyUztefrBEJ-XQC1qk3ss", // Directly added here
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     const fetchRideRequests = async () => {
//       try {
//         const response = await fetch(
//           `${host}/driver/riderequests/${location.state?.driverId}`
//         );
//         if (response.ok) {
//           const requestData = await response.json();
//           setRideRequests(requestData.rideRequests);
//         } else {
//           const errorData = await response.json();
//           setError(errorData.error);
//         }
//       } catch (error) {
//         console.error("Error fetching ride requests:", error);
//         setError("Server Error");
//       }
//     };

//     if (isLoaded) {
//       fetchRideRequests();
//     }
//   }, [location.state?.driverId, isLoaded]);

//   useEffect(() => {
//     if (rideRequests.length > 0 && isLoaded) {
//       const { source, destination } = rideRequests[0]; // Assuming only one request for simplicity
//       const directionsService = new window.google.maps.DirectionsService();
//       directionsService.route(
//         {
//           origin: source,
//           destination: destination,
//           travelMode: "DRIVING",
//         },
//         (result, status) => {
//           if (status === "OK") {
//             setDirections(result);
//             setDistance(result.routes[0].legs[0].distance.text); // Set distance
//             setDuration(result.routes[0].legs[0].duration.text); // Set duration
//           } else {
//             console.error("Directions request failed due to " + status);
//           }
//         }
//       );
//     }
//   }, [rideRequests, isLoaded]);

//   const handleTripButton = async () => {
//     const numericValue = distance.replace(/[^\d.]/g, "");
//     const numericDistance = parseFloat(numericValue);
//     await calcCarbon(vehicle, numericDistance);
//     // await deletePassengerAndDriver();
//     navigate("/car-pooling");
//   };

//   const handleAcceptRequest = async (requestId) => {
//     try {
//       const response = await fetch(`${host}/driver/accept-request/${requestId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "auth-token": localStorage.getItem("token"),
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to accept request");
//       }

//       toast.success("Ride request accepted successfully!");
      
//       // Refresh ride requests after accepting
//       setRideRequests(rideRequests.filter((req) => req._id !== requestId));

//     } catch (error) {
//       console.error("Error accepting ride request:", error);
//       toast.error("Failed to accept ride request");
//     }
//   };

//   return (
//     <div className="container mx-2 mt-8 px-4">
//       <div className="mt-8">
//         <h2 className="text-3xl font-semibold mb-4 text-custom-green">
//           Ride Requests
//         </h2>
//         {error && <p className="text-red-600 mb-4">{error}</p>}
//         {rideRequests.length > 0 ? (
//           <ul>
//             {rideRequests.map((request) => (
//               <div
//                 key={request._id}
//                 className="flex items-center justify-between mb-4"
//               >
//                 <div>
//                   <p>Source: {request.source}</p>
//                   <p>Destination: {request.destination}</p>
//                 </div>
//                 <div>
//                   <button
//                     className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
//                     onClick={() => handleAcceptRequest(request._id)}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     className="px-4 py-2 bg-red-500 text-white rounded-lg"
//                     // onClick={() => handleDeclineRequest(request._id)}
//                   >
//                     Decline
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </ul>
//         ) : (
//           <p>No ride requests</p>
//         )}
//       </div>
//       <div className="mt-8">
//         <h2 className="text-3xl font-semibold mb-4 text-custom-green">
//           Route Map
//         </h2>
//         {isLoaded && (
//           <div style={{ height: "400px", width: "100%" }}>
//             <GoogleMap
//               center={center}
//               zoom={12}
//               mapContainerStyle={{ height: "100%", width: "100%" }}
//               onLoad={setMap}
//               options={{
//                 zoomControl: false,
//                 streetViewControl: false,
//                 mapTypeControl: false,
//                 fullScreenControl: false,
//               }}
//             >
//               {directions && <DirectionsRenderer directions={directions} />}
//               {rideRequests.map((request) => (
//                 <Marker key={request._id} position={request.source} label="S" />
//               ))}
//               {rideRequests.map((request) => (
//                 <Marker
//                   key={request._id}
//                   position={request.destination}
//                   label="D"
//                 />
//               ))}
//             </GoogleMap>
//           </div>
//         )}
//       </div>
//       <div>
//         <span>Distance: {distance} </span>
//         <span>Duration: {duration} </span>
//       </div>
//       <div className="flex justify-center items-center">
//         <button
//           onClick={handleTripButton}
//           className="my-10 px-3 py-2 custom-button"
//         >
//           End Trip
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Requests;


import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GeneralContext from "../context/GeneralContext";
import toast from "react-hot-toast";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const center = { lat: 12.9716, lng: 77.5946 };

const Requests = () => {
  const navigate = useNavigate(); 
  const context = useContext(GeneralContext);
  const { setLeaderboardData } = context;
  const location = useLocation();
  const host = "http://localhost:5000";
  const [rideRequests, setRideRequests] = useState([]);
  const [error, setError] = useState("");
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const vehicle = location.state?.vehicle;
  const driverId = location.state?.driverId; // Assuming driverId is in location state

  console.log(vehicle);

  const calcCarbon = async (vehicle, distance) => {
    const url = "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_type";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer YOUR_BEARER_TOKEN_HERE`,
        "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY_HERE",
        "X-RapidAPI-Host": "YOUR_RAPIDAPI_HOST_HERE",
      },
      body: new URLSearchParams({
        vehicle_type: vehicle,
        distance_value: distance,
        distance_unit: "km",
      }),
    };

    try {
      const response = await fetch(url, options);
      const resultText = await response.text();
      const responseData = JSON.parse(resultText);
      const co2eGrams = responseData.data.co2e_gm;
      console.log(co2eGrams);
      const avgEmission = co2eGrams / distance;
      let coinsEarned = 0;
      if (avgEmission <= 100) {
        coinsEarned = 100;
      } else if (avgEmission > 100 && avgEmission < 160) {
        coinsEarned = 50;
      } else if (avgEmission >= 160 && avgEmission <= 255) {
        coinsEarned = 20;
      } else {
        coinsEarned = 10;
      }

      const temp = await setLeaderboardData(localStorage.getItem("name"), coinsEarned);
      const updatedData = await temp.find(
        (entry) => entry.user === localStorage.getItem("id")
      );
      const userCoins = updatedData.coins;
      localStorage.setItem("coins", userCoins);
      toast.success(`Earned ${coinsEarned} EcoCoins!, ${co2eGrams} grams carbon emitted`);
    } catch (error) {
      console.error(error);
    }
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA733VdZHskBkFyUztefrBEJ-XQC1qk3ss",
    libraries: ["places"],
  });

  // useEffect(() => {
  //   const fetchRideRequests = async () => {
  //     try {
  //       // const response = await fetch(`${host}/driver/riderequests/${driverId}`);
  //       const response = await fetch(`${host}/driver/riderequests`);
        
  //       if (response.ok) {
  //         const requestData = await response.json();
  //         setRideRequests(requestData.rideRequests);
  //       } else {
  //         const errorData = await response.json();
  //         setError(errorData.error);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching ride requests:", error);
  //       setError("Server Error");
  //     }
  //   };

  //   if (isLoaded) {
  //     fetchRideRequests();
  //   }
  // }, [driverId, isLoaded]);

  useEffect(() => {
    const fetchRideRequests = async () => {
      try {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
  
            // Fetch ride requests using user's location
            const response = await fetch(
              `${host}/driver/riderequests?latitude=${latitude}&longitude=${longitude}`
            );
  
            if (response.ok) {
              const requestData = await response.json();
              setRideRequests(requestData.rideRequests);
            } else {
              const errorData = await response.json();
              setError(errorData.error);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            setError("Please allow location access to find nearby ride requests.");
          }
        );
      } catch (error) {
        console.error("Error fetching ride requests:", error);
        setError("Server Error");
      }
    };
  
    if (isLoaded) {
      fetchRideRequests();
    }
  }, [isLoaded]);
  

  useEffect(() => {
    if (rideRequests.length > 0 && isLoaded) {
      const { source, destination } = rideRequests[0]; // Assuming only one request for simplicity
      const directionsService = new window.google.maps.DirectionsService();
      console.log("Direction Save is :",directionsService);
      directionsService.route(
        {
          origin: source,
          destination: destination,
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
            setDistance(result.routes[0].legs[0].distance.text); // Set distance
            setDuration(result.routes[0].legs[0].duration.text); // Set duration
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  }, [rideRequests, isLoaded]);

  const handleTripButton = async () => {
    const numericValue = distance.replace(/[^\d.]/g, "");
    const numericDistance = parseFloat(numericValue);
    await calcCarbon(vehicle, numericDistance);
    navigate("/car-pooling");
  };


  // TODO: To handle The Acceptance
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`${host}/driver/accept-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to accept request");
      }

      toast.success("Ride request accepted successfully!");

      // Refresh ride requests after accepting
      setRideRequests(rideRequests.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error accepting ride request:", error);
      toast.error("Failed to accept ride request");
    }
  };

    // TODO: To handle The Declination
  const handleDeclineRequest = async (requestId) => {
    try {
      const response = await fetch(`${host}/driver/decline-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to decline request");
      }

      toast.success("Ride request declined successfully!");

      // Remove declined request from the list
      setRideRequests(rideRequests.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Error declining ride request:", error);
      toast.error("Failed to decline ride request");
    }
  };

  return (
    <div className="container mx-2 mt-8 px-4">
      <div className="mt-8">
        <h2 className="text-3xl font-semibold mb-4 text-custom-green">Ride Requests</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {rideRequests.length > 0 ? (
          <ul>
            {rideRequests.map((request) => (
              <div key={request._id} className="flex items-center justify-between mb-4">
                <div>
                  <p>Source: {request.source}</p>
                  <p>Destination: {request.destination}</p>
                </div>
                <div>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
                    onClick={() => handleAcceptRequest(request._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => handleDeclineRequest(request._id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p>No ride requests</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-semibold mb-4 text-custom-green">Route Map</h2>
        {isLoaded && (
          <div style={{ height: "400px", width: "100%" }}>
            <GoogleMap
              center={center}
              zoom={12}
              mapContainerStyle={{ height: "100%", width: "100%" }}
              onLoad={setMap}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullScreenControl: false,
              }}
            >
              {directions && <DirectionsRenderer directions={directions} />}
              {rideRequests.map((request) => (
                <Marker key={request._id} position={request.source} label="S" />
              ))}
              {rideRequests.map((request) => (
                <Marker
                  key={request._id}
                  position={request.destination}
                  label="D"
                />
              ))}
            </GoogleMap>
          </div>
        )}
      </div>

      <div>
        <span>Distance: {distance}</span>
        <span>Duration: {duration}</span>
      </div>

      <div className="flex justify-center items-center">
        <button onClick={handleTripButton} className="my-10 px-3 py-2 custom-button">
          End Trip
        </button>
      </div>
    </div>
  );
};

export default Requests;
  