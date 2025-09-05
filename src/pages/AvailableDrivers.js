// import React, { useState } from "react";
// import passenger from "../assets/passenger.jpg";
// import { useLocation } from "react-router-dom";
// import toast from "react-hot-toast";

// const AskForRide = () => {
//   const host = "http://localhost:5000";
//   const location = useLocation();

//   const drivers = location.state?.drivers;
//   const passengerId = location.state?.passengerId;
//   const source = location.state?.source;
//   const destination = location.state?.destination;

//   // State to keep track of drivers to whom ride requests have been sent
//   const [requestedDrivers, setRequestedDrivers] = useState([]);

//   const handleRequestRide = async (driverId) => {
//     try {
//       const response = await fetch(`${host}/driver/askride/${driverId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "auth-token": localStorage.getItem("token"),
//         },
//         body: JSON.stringify({
//           source,
//           destination,
//           passengerId,
//         }),
//       });

//       if (response.ok) {
//         // Update requestedDrivers state to include the driverId
//         setRequestedDrivers([...requestedDrivers, driverId]);
//         console.log("Ride request sent successfully", response);
//         toast.success("Ride request sent successfully");
//       } else {
//         console.error("Error sending ride request:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error sending ride request:", error);
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("Form submitted:", { source, destination });
//   };

//   return (
//     <div className="container mx-auto mt-2 px-4">
//       <div>
//         <h3 className="text-2xl font-semibold mb-4">Available Drivers:</h3>
//         <ul>
//           {drivers.map((driver) => (
//             <li key={driver._id} className="mb-4">
//               <div className="flex items-center">
//                 <div className="flex-1">
//                   <p className="text-lg font-semibold text-black">{driver.name}</p>
//                   <p className="text-gray-600">Vehicle: {driver.vehicle}</p>
//                   <p className="text-gray-600">Seats: {driver.seats}</p>
//                 </div>
//                 <button
//                   onClick={() => handleRequestRide(driver._id)}
//                   className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
//                   disabled={requestedDrivers.includes(driver._id)} // Disable button if ride request already sent
//                 >
//                   {requestedDrivers.includes(driver._id)
//                     ? "Request Sent"
//                     : "Request Ride"}
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AskForRide;


import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const AskForRide = () => {
  const host = "http://localhost:5000";
  const location = useLocation();

  // Extract state variables
  const drivers = location.state?.drivers || [];
  const passengerId = location.state?.passengerId;
  const source = location.state?.source;
  const destination = location.state?.destination;
  const sourceLat = location.state?.sourceLat;
  const sourceLng = location.state?.sourceLng;
  const destLat = location.state?.destLat;
  const destLng = location.state?.destLng;

  // State to track requested drivers
  const [requestedDrivers, setRequestedDrivers] = useState([]);

  // Function to request a ride
  const handleRequestRide = async (driverId) => {
    try {
      const response = await fetch(`${host}/driver/askride/${driverId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          source: { name: source, coordinates: [sourceLat, sourceLng] },
          destination: { name: destination, coordinates: [destLat, destLng] },
          passengerId,
        }),
      });

      if (response.ok) {
        setRequestedDrivers([...requestedDrivers, driverId]);
        toast.success("Ride request sent successfully");
      } else {
        console.error("Error sending ride request:", response.statusText);
        toast.error("Failed to send ride request");
      }
    } catch (error) {
      console.error("Error sending ride request:", error);
      toast.error("Server error while sending request");
    }
  };

  return (
    <div className="container mx-auto mt-2 px-4">
      <h3 className="text-2xl font-semibold mb-4">Available Drivers:</h3>
      <ul>
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <li key={driver._id} className="mb-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-black">{driver.name}</p>
                  <p className="text-gray-600">Vehicle: {driver.vehicle}</p>
                  <p className="text-gray-600">Seats: {driver.seats}</p>
                </div>
                <button
                  onClick={() => handleRequestRide(driver._id)}
                  className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
                  disabled={requestedDrivers.includes(driver._id)}
                >
                  {requestedDrivers.includes(driver._id) ? "Request Sent" : "Request Ride"}
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No drivers available in your area.</p>
        )}
      </ul>
    </div>
  );
};

export default AskForRide;
