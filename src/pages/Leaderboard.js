import React, { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa";
import GeneralContext from "../context/GeneralContext";

const Leaderboard = () => {
  const context = useContext(GeneralContext);
  const { Data, getLeaderboardData } = context;

  useEffect(() => {
    getLeaderboardData();
  }, []);

  const currentUserIndex = Data.findIndex(
    (entry) => entry.user === localStorage.getItem("id")
  );

  if (currentUserIndex !== -1) {
    const currentUserData = Data.splice(currentUserIndex, 1)[0];
    Data.unshift(currentUserData);
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500 text-2xl" />;
    if (rank === 2) return <FaMedal className="text-gray-400 text-2xl" />;
    if (rank === 3) return <FaMedal className="text-orange-600 text-2xl" />;
    return <FaAward className="text-green-500 text-xl" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl text-custom-green font-bold mb-8 text-center"
        >
          🏆 Leaderboard
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center mb-8 max-w-2xl"
        >
          Compete with fellow eco-warriors and earn your spot on the leaderboard!
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4">
              <h3 className="text-white text-2xl font-bold text-center">Top Contributors</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-100">
                  <tr>
                    <th className="text-center px-6 py-4 text-sm font-bold text-custom-green uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-bold text-custom-green uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-bold text-custom-green uppercase tracking-wider">
                      Eco-Coins
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Data.map((entry, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                      className={`${
                        entry.user === localStorage.getItem("id")
                          ? "bg-green-200 font-bold text-green-800"
                          : index % 2 === 0
                          ? "bg-gray-50"
                          : "bg-white"
                      } ${index !== Data.length - 1 ? "border-b border-gray-200" : ""} transition-all cursor-pointer`}
                    >
                      <td className="text-center px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          {getRankIcon(entry.rank)}
                          <span className="text-lg font-bold">{entry.rank}</span>
                        </div>
                      </td>
                      <td className="text-center px-6 py-4 whitespace-nowrap text-lg">
                        {entry.Sname}
                        {entry.user === localStorage.getItem("id") && (
                          <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">You</span>
                        )}
                      </td>
                      <td className="text-center px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-green-600">{entry.coins} 🪙</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
