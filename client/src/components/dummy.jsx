import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TableView from "./Tableview";

const TableDetail = () => {
  const { id } = useParams();
  const [table, setTable] = useState(null);
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [editedRow, setEditedRow] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [columnTypes, setColumnTypes] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchTable = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        return;
      }

      try {
        const res = await axios.get(`https://zynck-project-2.onrender.com/table/${id}`, {
          headers: { Authorization: `${token}` },
        });
        setTable(res.data);
        setRows(res.data.rows);
        setColumnTypes(res.data.columnTypes || Array(res.data.columns.length).fill("Text"));
      } catch (err) {
        console.error("Error loading table:", err);
      }
    };

    fetchTable();
  }, [id]);

  const validateInput = (col, value) => {
    const colIndex = table.columns.indexOf(col);
    const type = columnTypes[colIndex];

    if (!value.trim()) return true;

    switch (type.toLowerCase()) {
      case "number":
        return !isNaN(value);
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "boolean":
        return value === "true" || value === "false" || value === "True" || value === "False";
      case "date":
        return !isNaN(Date.parse(value));
      case "telephone":
        return /^\d{10}$/.test(value);
      case "password":
        return value.length >= 6;
      default:
        return true;
    }
  };

  const handleEditRow = (idx) => {
    setEditingRow(idx);
    setEditedRow({ ...rows[idx].rowData });
  };

  const handleChangeNewRow = (col, value) => {
    setNewRow({ ...newRow, [col]: value });
  };

  const handleChangeEditedRow = (col, value) => {
    setEditedRow({ ...editedRow, [col]: value });
  };

  const handleSaveRow = async (idx) => {
    for (let col of table.columns) {
      const value = editedRow[col] || "";
      if (!validateInput(col, value)) {
        alert(`Invalid input for column "${col}" of type "${columnTypes[table.columns.indexOf(col)]}"`);
        return;
      }
    }
    try {
      const currentRow = rows[idx];
      if (!currentRow || !currentRow._id) {
        console.warn("Trying to save a row without an _id.!");
        setEditingRow(null);
        return;
      }
      const cleanedRow = {};
      for (let col of table.columns) {
        cleanedRow[col] = editedRow[col] || "";
      }
      const res = await axios.put(
        `https://zynck-project-2.onrender.com/tables/${table._id}/rows/${currentRow._id}`,
        { rowData: cleanedRow }
      );
      const updatedRows = [...rows];
      updatedRows[idx] = res.data;
      setRows(updatedRows);
      setEditingRow(null);
    } catch (err) {
      console.error("Error saving row", err);
      alert("Failed to save row");
    }
  };

  const handleDeleteRow = async (idx) => {
    const rowId = rows[idx]._id;
    try {
      await axios.delete(`https://zynck-project-2.onrender.com/tables/${table._id}/rows/${rowId}`);
      setRows(rows.filter((_, i) => i !== idx));
    } catch (err) {
      console.error("error deleting row", err);
      alert("failed to delete row");
    }
  };

  const handleAddRow = async () => {
    if (!table || !table._id) return;
    for (let col of table.columns) {
      const value = newRow[col] || "";
      if (!validateInput(col, value)) {
        alert(`Invalid input for column "${col}" of type "${columnTypes[table.columns.indexOf(col)]}"`);
        return;
      }
    }
    try {
      const res = await axios.post(`https://zynck-project-2.onrender.com/tables/${table._id}/rows`, newRow);
      setRows([...rows, res.data]);
      setNewRow({});
    } catch (err) {
      console.error("Error adding row", err);
      alert("failed to add row:" + (err.response?.data.error || "unknown error"));
    }
  };

  const handleSaveTable = async () => {
    try {
      const hasnewrow = Object.values(newRow).some((val) => val.trim() !== "");
      let updatedRow = [...rows];
      if (hasnewrow) {
        const res = await axios.post(`https://zynck-project-2.onrender.com/tables/${table._id}/rows`, newRow);
        updatedRow.push(res.data);
        setRows(updatedRow);
        setNewRow({});
      }
      const saveres = await axios.put(
        `https://zynck-project-2.onrender.com/table/${table._id}`,
        {
          ...table,
          rows: updatedRow,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Table saved successfully");
      setEditMode(false);
      setTable(saveres.data);
    } catch (err) {
      console.log("save error:", err);
      alert("failed to save table");
    }
  };

  const handleAddColumn = () => {
    const newColumnName = prompt("Enter new column name:");
    if (!newColumnName) return;
    const updatedColumns = [...table.columns, newColumnName];
    setTable({ ...table, columns: updatedColumns });
    const updatedRows = rows.map((row) => ({
      ...row,
      rowData: {
        ...row.rowData,
        [newColumnName]: "",
      },
    }));
    setRows(updatedRows);
    setNewRow({ ...newRow, [newColumnName]: "" });
    setColumnTypes([...columnTypes, "Text"]);
  };

  if (!table) return <p className="text-center mt-10">Loading Table...</p>;

  if (!editMode) {
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
        <div className="flex justify-center mt-5">
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Table
          </button>
        </div>
      </div>
    );
  }

  return (
    <TableView
      table={table}
      rows={rows}
      newRow={newRow}
      editedRow={editedRow}
      editingRow={editingRow}
      handleEditRow={handleEditRow}
      handlesaverow={handleSaveRow}
      seteditingRow={setEditingRow}
      handledetelerow={handleDeleteRow}
      handleChangeNewRow={handleChangeNewRow}
      handlechangeeditedrow={handleChangeEditedRow}
      handleAddRow={handleAddRow}
      handleAddColumn={handleAddColumn}
      handlesaveTable={handleSaveTable}
      columnTypes={columnTypes}
      setColumnTypes={setColumnTypes}
      showActions={true}
    />
  );
};

export default TableDetail;
