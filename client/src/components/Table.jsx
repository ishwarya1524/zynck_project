import axios from "axios"
import { useState, useEffect } from "react"
import TableView from "./Tableview"; './Tableview'

function App() {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([''])
  const [table, setTable] = useState(null)
  const [rows, setRows] = useState([])
  const [newRow, setNewRow] = useState({});
  const [editingRow, seteditingRow] = useState(null);
  const [editedRow, seteditedRow] = useState({});
  const [columnTypes, setColumnTypes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const saved = localStorage.getItem("unsavedTableData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setNewRow(parsed.newRow || {});
      setColumnTypes(parsed.columnTypes || []);
    }
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if (Object.keys(newRow).some((key) => newRow[key]?.trim() !== "")) {
        e.preventDefault()
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [newRow]);
  const handleCreateTable = async () => {
    try {
      const res = await axios.post('http://localhost:5000/table', {
        tableName,
        columns,
      }, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setTable(res.data);
      setColumnTypes(columns.map(() => "Text"))
    }
    catch (err) {
      console.log("error creating table", err);
      alert("failed to create table")

    }
  };

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

  const handleAddRow = async () => {
    if (!table || !table._id) return;

    for (let col of table.columns) {
      const value = newRow[col] || ""
      if (!validateInput(col, value)) {
        alert(`Invalid input for column "${col}" of type "${columnTypes[table.columns.indexOf(col)]}`)
      };
    }

    try {
      const res = await axios.post(`http://localhost:5000/tables/${table._id}/rows`, newRow);
      setRows([...rows, res.data]);
      setNewRow({});
    } catch (err) {
      console.error("Error adding row", err);
      alert("failed to add row:" + (err.response?.data.error || "unknown error"));
    }
  };


  const handleEditRow = (idx) => {
    seteditingRow(idx);
    seteditedRow({ ...rows[idx].rowData });
  }

  const handlechangeeditedrow = (col, value) => {
    seteditedRow((prev) => ({ ...prev, [col]: value }))
  }

  const handlesaverow = async (idx) => {
    for (let col of table.columns) {
      const value = editedRow[col] || ""
      if (!validateInput(col, value)) {
        alert(`Invalid input for column "${col}" of type "${columnTypes[table.columns.indexOf(col)]}`)
        return;
      }
    }
    try {
      const currentRow = rows[idx];
      if (!currentRow || !currentRow._id) {
        console.warn("Trying to save a row without an _id.!");
        seteditingRow(null);
        return;
      }
      const cleanedRow = {}
      for (let col of table.columns) {
        cleanedRow[col] = editedRow[col] || "";

      }
      const res = await axios.put(
        `http://localhost:5000/tables/${table._id}/rows/${currentRow._id}`,
        { rowData: cleanedRow }
      );
      const updataedRow = [...rows];
      updataedRow[idx] = res.data;
      setRows(updataedRow);
      seteditingRow(null);
    }
    catch (err) {
      console.error("Error saving row", err);
      alert("Failed to save row")
    }
  }

  const handledetelerow = async (idx) => {
    const rowId = rows[idx]._id;
    try {
      await axios.delete(`http://localhost:5000/tables/${table._id}/rows/${rowId}`);
      setRows(rows.filter((_, i) => i !== idx));
    }
    catch (err) {
      console.error("error deleting row", err);
      alert("failed to delete row")

    }
  }

  const handleDeleteColumn = (colIndex) => {
    // Remove column name from the table's columns
    const updatedColumns = [...table.columns];
    const removedColumn = updatedColumns.splice(colIndex, 1)[0];

    // Update each row to remove the column's data
    const updatedRows = rows.map((row) => {
      const updatedRowData = { ...row.rowData };
      delete updatedRowData[removedColumn];
      return {
        ...row,
        rowData: updatedRowData,
      };
    });

    // Update column types to remove the deleted one
    const updatedColumnTypes = [...columnTypes];
    updatedColumnTypes.splice(colIndex, 1);

    // Update the states
    setTable((prev) => ({ ...prev, columns: updatedColumns }));
    setRows(updatedRows);
    setColumnTypes(updatedColumnTypes);
  };


  const handleChangeNewRow = (col, value) => {
    setNewRow({ ...newRow, [col]: value });
  };

  const handlesaveTable = async () => {
    try {

      const hasnewrow = Object.values(newRow).some(val => val.trim() !== '');

      let updatedRow = [...rows]

      if (hasnewrow) {
        const res = await axios.post(`http://localhost:5000/tables/${table._id}/rows`, newRow);
        updatedRow.push(res.data);
        setRows(updatedRow);
        setNewRow({});
      }
      const saveres = await axios.put(`http://localhost:5000/table/${table._id}`, {
        ...table,
        rows: updatedRow,
      }, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },

      })
      alert("table saved successfully")
      localStorage.removeItem("unsavedTableData");
      setTable(saveres.data);
    }
    catch (err) {
      console.log("save error:", err);
      alert("failed to save table")
    }
  }

  const handleAddColumn = () => {
    const newcolumnname = prompt("Enter new column name:");
    if (!newcolumnname) return;

    const updatedColumns = [...table.columns, newcolumnname];
    setTable({ ...table, columns: updatedColumns });

    const updatedRow = rows.map((row) => ({
      ...row,
      rowData: {
        ...row.rowData,
        [newcolumnname]: ""
      }
    }));
    setRows(updatedRow);

    setNewRow({ ...newRow, [newcolumnname]: "" })
  }

  useEffect(() => {
    const fetchTableAndRows = async () => {
      if (table && table._id) {
        try {
          const res = await axios.get(`http://localhost:5000/tables/${table._id}`);
          setTable(res.data.table);
          setRows(res.data.rows);
        }
        catch (err) {
          console.error("Error fetching rows", err);
        }
      }
    }
    fetchTableAndRows();
  }, [table?._id]);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
      {!table ? (
        <>
          <h2 className="text-blue-700 font-bold text-3xl mb-7">Welcome, {user?.name}</h2>
          <div className="flex flex-col justify-center items-center border-2 w-1/2 rounded-md gap-3 shadow-lg bg-white">
            <h2 className="text-blue-500 text-2xl font-bold mt-3">Create a Table</h2>
            <input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Table name"
              className="border-1 w-90 p-3 rounded-sm"
            />
            {columns.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <input
                  value={col}
                  onChange={(e) => {
                    const copy = [...columns];
                    copy[idx] = e.target.value;
                    setColumns(copy);
                  }}
                  placeholder={`Column ${idx + 1}`}
                  className="border-1 w-90 p-3 rounded-sm"
                />
              </div>
            ))}
            <button
              onClick={() => setColumns([...columns, ""])}
              className="border-2 w-90 p-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-500 cursor-pointer hover:scale-102 transition ease-in-out duration:1000"
            >
              + Add Column
            </button>
            <br />
            <br />
            <button
              onClick={handleCreateTable}
              className="border-2 w-60 mb-5 p-3 rounded-sm bg-blue-200 hover:bg-blue-500 hover:rounded-full transition-all duration-1000 cursor-pointer"
            >
              Create Table
            </button>
          </div>
        </>
      ) : (
        <TableView
          table={table}
          rows={rows}
          newRow={newRow}
          editedRow={editedRow}
          editingRow={editingRow}
          handleEditRow={handleEditRow}
          handlesaverow={handlesaverow}
          seteditingRow={seteditingRow}
          handledetelerow={handledetelerow}
          handleChangeNewRow={handleChangeNewRow}
          handlechangeeditedrow={handlechangeeditedrow}
          handleAddRow={handleAddRow}
          handleAddColumn={handleAddColumn}
          handleDeleteColumn={handleDeleteColumn}
          handlesaveTable={handlesaveTable}
          columnTypes={columnTypes}
          setColumnTypes={setColumnTypes}
        />
      )}
    </div>
  );



}


export default App;
