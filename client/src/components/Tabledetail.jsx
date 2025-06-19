import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TableDetail = () => {
  const { id } = useParams();
  const [table, setTable] = useState(null);
  const [rows, setRows] = useState([]);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
console.log("Token being used:", token);
if (!token) {
  alert("Please login first!");
  return;
}

    axios
      .get(`http://localhost:5000/table/${id}`, {
        headers: { Authorization: `${token}` },
      })
      .then((res) => {
        setTable(res.data);
        setRows(res.data.rows);
      })
      .catch((err) => {
        console.error("Error loading table:", err);
        if (err.response) {
          console.error("Status:", err.response.status);
          console.error("Data:", err.response.data);
        }
      });
      
  }, [id]);

  if (!table) return <p className="text-center mt-10">Loading Table...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        {table.tableName}
      </h2>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-blue-700 w-full">
          <thead>
            <tr>
              {table.columns.map((col, i) => (
                <th key={i} className="border border-blue-700 px-4 py-2 bg-blue-100">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row._id || idx}>
                {table.columns.map((col, i) => (
                  <td key={i} className="border px-4 py-2 text-center">
                    {row.rowData[col] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDetail;
