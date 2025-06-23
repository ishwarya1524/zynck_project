// Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDelete=async(id)=>{
    const confirmDelete = window.confirm("Are you sure you want to delete this table?");
  if (!confirmDelete) return;
    try{
      await axios.delete(`https://zynck-project-1.onrender.com/tables/${id}`);
      setTables(prev=>prev.filter(t=>t._id!==id));
    }
    catch(err){
      console.log("Error deleting Table:",err);
      alert("Failed to delete Table")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }

    axios.get("https://zynck-project-1.onrender.com/tables", {
      headers: { Authorization: `${token}` }
    })
    .then(res => {
      console.log("Got tables:", res.data);
      setTables(res.data);
    })
    .catch(err => console.error("Error fetching tables", err))
    .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center bg-blue-900 p-3 rounded-lg text-white">Your Tables</h1>
      {tables.length === 0 ? (
        <p>No tables created yet.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tables.map(table => (
            <div
              key={table._id}
              className=" relative p-4 border-2  border-black rounded-lg cursor-pointer bg-white hover:bg-blue-200 group"
              onClick={() => navigate(`/table/${table._id}`)}
            >

              <button onClick={(e)=>{
                e.stopPropagation();
                handleDelete(table._id)
              }} className="top-2 right-2 absolute bg-red-500 text-white rounded-full pl-1 pr-1 text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition">&times;</button>

              <h2 className="text-xl font-semibold">{table.tableName}</h2>
              <p>Columns: {table.columns.length}</p>
              <p>Rows: {table.rows.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
