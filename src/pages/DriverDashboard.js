import { useEffect, useState } from "react";
import io from "socket.io-client";

const DriverDashboard = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const socket = io("http://localhost:5000");

    // Listen for new ride requests
    socket.on("new-ride-request", (data) => {
      alert(data.message); // Show notification about the new ride request
      setRideRequests((prevRequests) => [...prevRequests, data.request]); // Add new ride request to state
    });

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    // Fetch current ride requests when the component mounts
    const fetchRideRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/driver/ride-requests", {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("token"), // Pass the auth token in the request header
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch ride requests");
        }
        const data = await response.json();
        setRideRequests(data.rideRequests);
      } catch (error) {
        setError("Failed to load ride requests");
      }
    };

    fetchRideRequests();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/driver/accept-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to accept ride request");
      }

      setRideRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      ); // Remove accepted request from the list

      alert("Ride request accepted!");
    } catch (error) {
      alert("Error accepting ride request");
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/driver/decline-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to decline ride request");
      }

      setRideRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      ); // Remove declined request from the list

      alert("Ride request declined!");
    } catch (error) {
      alert("Error declining ride request");
    }
  };

  return (
    <div>
      <h2>Driver Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {rideRequests.length === 0 ? (
        <p>No new ride requests</p>
      ) : (
        <ul>
          {rideRequests.map((request) => (
            <li key={request._id}>
              <div>
                <p>Passenger: {request.passengerName}</p>
                <p>Source: {request.source}</p>
                <p>Destination: {request.destination}</p>
                <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                <button onClick={() => handleDeclineRequest(request._id)}>Decline</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverDashboard;
