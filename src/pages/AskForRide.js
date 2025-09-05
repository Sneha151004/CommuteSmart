// import React, { useEffect, useState } from "react";
// import passenger from "../assets/passenger.jpg";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const AskForRide = () => {
//   const host = "http://localhost:5000";
//   const navigate = useNavigate();
//   const [source, setSource] = useState("");
//   const [destination, setDestination] = useState("");
//   const [drivers, setDrivers] = useState([]);
//   const [passengerId, setPassengerId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [requestedDrivers, setRequestedDrivers] = useState([]);

//   // Fetch drivers based on source and destination
//   useEffect(() => {
//     const fetchDrivers = async () => {
//       if (!source.trim() || !destination.trim()) return;
  
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(
//           `${host}/driver/availabledrivers?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "auth-token": localStorage.getItem("token"),
//             },
//           }
//         );
  
//         if (!response.ok) throw new Error("Failed to fetch drivers");
  
//         const responseData = await response.json();
//         console.log("Fetched Drivers:", responseData); // Check the structure of the response
//         setDrivers(responseData.availableDrivers || []);
//         setPassengerId(responseData.newPassenger?._id || null);
//       } catch (error) {
//         console.error("Error fetching drivers:", error);
//         setError("Could not fetch available drivers. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchDrivers();
//   }, [source, destination]);
  
//   // Handle ride request for the selected driver
//   const handleRequestRide = async (driverId) => {
//     if (!driverId) {
//       console.error("Invalid driver ID.");
//       toast.error("Invalid driver. Please try again.");
//       return;
//     }
  
//     console.log("Requesting ride with the following data:", {
//       source,
//       destination,
//       passengerId,
//     });
  
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
  
//       console.log("Response status:", response.status);
  
//       if (response.ok) {
//         // Successfully sent the request
//         setRequestedDrivers((prevState) => [...prevState, driverId]);
//         console.log("Ride request sent successfully", response);
//         toast.success("Ride request sent successfully");
//       } else {
//         const errorData = await response.json();
//         console.error("Error sending ride request:", errorData);
//         toast.error(`Error: ${errorData.message || response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error sending ride request:", error);
//       toast.error("An error occurred while sending the request");
//     }
//   };
  

//   // Handle form submission
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (!source.trim() || !destination.trim()) {
//       alert("Please fill in both source and destination fields.");
//       return;
//     }

//     navigate("/car-pooling/askforride/availabledrivers", {
//       state: { drivers, passengerId, source, destination },
//     });
//   };

//   return (
//     <div className="container mx-auto mt-2 px-4">
//       <div className="flex justify-center items-center mb-8">
//         <form onSubmit={handleSubmit} className="flex-1 mr-8">
//           <h2 className="text-3xl font-semibold mb-4 text-custom-green">Ask For Ride</h2>
//           <div className="mb-4">
//             <label htmlFor="source" className="block text-lg font-semibold mb-2">Source:</label>
//             <input
//               type="text"
//               id="source"
//               value={source}
//               onChange={(e) => setSource(e.target.value)}
//               placeholder="Enter source"
//               className="w-full px-4 py-2 border rounded"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="destination" className="block text-lg font-semibold mb-2">Destination:</label>
//             <input
//               type="text"
//               id="destination"
//               value={destination}
//               onChange={(e) => setDestination(e.target.value)}
//               placeholder="Enter destination"
//               className="w-full px-4 py-2 border rounded"
//             />
//           </div>
//           {error && <p className="text-red-500">{error}</p>}
//           <button
//             className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "Available drivers"}
//           </button>
//         </form>
//         <div className="flex-1 md:block hidden">
//           <img src={passenger} alt="Passenger" className="w-full h-auto" />
//         </div>
//       </div>

//       <div>
//         <h3 className="text-2xl font-semibold mb-4">Available Drivers:</h3>
//         <ul>
//         {drivers.length > 0 ? (
//   drivers.map((driver) => (
//     <li key={driver._id} className="mb-4">
//       <div className="flex items-center">
//         <div className="flex-1">
//           <p className="text-lg font-semibold">{driver.name}</p>
//           <p className="text-gray-600">Vehicle: {driver.vehicle}</p>
//           <p className="text-gray-600">Seats: {driver.seats}</p>
//         </div>
//         <button
//           onClick={() => handleRequestRide(driver._id)} // Pass the driver._id
//           className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
//           disabled={requestedDrivers.includes(driver._id)}
//         >
//           {requestedDrivers.includes(driver._id)
//             ? "Request Sent"
//             : "Request Ride"}
//         </button>
//       </div>
//     </li>
//   ))
// ) : (
//   <p>No drivers available</p>
// )}

//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AskForRide;



import React, { useEffect, useState } from "react";
import passenger from "../assets/passenger.jpg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AskForRide = () => {
  const host = "http://localhost:5000";
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [passengerId, setPassengerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestedDrivers, setRequestedDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      if (!source.trim() || !destination.trim()) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${host}/driver/availabledrivers?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch drivers");

        const responseData = await response.json();
        setDrivers(responseData.availableDrivers || []);
        setPassengerId(responseData.newPassenger?._id || null);
      } catch (error) {
        setError("Could not fetch available drivers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [source, destination]);

  const handleRequestRide = async (driverId) => {
    if (!driverId) {
      toast.error("Invalid driver. Please try again.");
      return;
    }

    if (!source.trim() || !destination.trim()) {
      toast.error("Source and destination are required.");
      return;
    }

    if (!passengerId) {
      toast.error("Passenger ID is missing. Please try again.");
      return;
    }

    console.log("Requesting ride with:", { source, destination, passengerId });

    try {
      const response = await fetch(`${host}/driver/askride/${driverId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          source,
          destination,
          passengerId,
          
        }),
      });

      const responseData = await response.json();
      console.log("Server Response:", responseData);

      if (response.ok) {
        setRequestedDrivers((prev) => [...prev, driverId]);
        toast.success("Ride request sent successfully");
      } else {
        toast.error(`Error: ${responseData.message || "Request failed"}`);
      }
    } catch (error) {
      console.error("Error sending ride request:", error);
      toast.error("An error occurred while sending the request");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!source.trim() || !destination.trim()) {
      toast.error("Please fill in both source and destination fields.");
      return;
    }
    navigate("/car-pooling/askforride/availabledrivers", {
      state: { drivers, passengerId, source, destination },
    });
  };

  return (
    <div className="container mx-auto mt-2 px-4">
      <div className="flex justify-center items-center mb-8">
        <form onSubmit={handleSubmit} className="flex-1 mr-8">
          <h2 className="text-3xl font-semibold mb-4 text-custom-green">Ask For Ride</h2>
          <div className="mb-4">
            <label htmlFor="source" className="block text-lg font-semibold mb-2">Source:</label>
            <input
              type="text"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="destination" className="block text-lg font-semibold mb-2">Destination:</label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Available drivers"}
          </button>
        </form>
        <div className="flex-1 md:block hidden">
          <img src={passenger} alt="Passenger" className="w-full h-auto" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Available Drivers:</h3>
        <ul>
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <li key={driver._id} className="mb-4">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{driver.name}</p>
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
            <p>No drivers available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AskForRide;
