import React, { useState } from "react";

const TableView = ({
  table,
  rows,
  newRow,
  editedRow,
  editingRow,
  handleEditRow,
  handlesaverow,
  seteditingRow,
  handledetelerow,
  handleChangeNewRow,
  handlechangeeditedrow,
  handleAddRow,
  handleDeleteColumn,
  handleAddColumn,
  handlesaveTable,
  columnTypes,
  downloadpdf,
  setColumnTypes,
  downloadCSV,
  showActions = true,
}) => {
  const [showoptionmodel, setShowoptionmodel] = useState(false);
  const [selectedcolumnindex, setselectedcolumnindex] = useState(null);
  const [optiontype, setOptionstype] = useState("");
  const [boxname, setBoxname] = useState("");
  const [numoptions, setNumberoptions] = useState(0);
  const [options, setOptions] = useState([]);
  const [columnoptions, setcolumnoptions] = useState({});

  return (
    <div className="flex flex-col justify-center min-h-screen items-center overflow-x-auto  w-full">
      <div className="w-full flex flex-col gap-3 justify-evenly">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-blue-400 font-bold text-3xl mb-5 text-center">
          {table.tableName}
        </h2>
        <div className="flex justify-center items-center gap-3 w-full">
        <button className="bg-gradient-to-r from-blue-400 to-purple-500 w-1/6 p-2 rounded-full cursor-pointer text-white font-bold hover:scale-105 transition ease-in-out duration-1000" onClick={()=>downloadCSV(table.tableName,table.columns,rows)}>Download as CSV</button>
        <button className="bg-gradient-to-r from-blue-400 to-purple-500 w-1/6 p-2 rounded-full cursor-pointer text-white font-bold hover:scale-105 transition ease-in-out duration-1000" onClick={()=>downloadpdf(table.tableName,table.columns,rows)}>Download as pdf</button>
        </div>
        </div>

        <table className="table-auto border border-collapse w-full bg-white">
          <thead>
            <tr>
              {table.columns.map((col, idx) => (
                <th key={idx} className="border-2 border-blue-900 p-2 relative group hover:bg-blue-200 cursor-pointer">
                  {col}
                  <select
                    className=" rounded  ml-3 bg-gray-200 p-2"
                    value={columnTypes[idx]}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updated = [...columnTypes];
                      updated[idx] = e.target.value;
                      setColumnTypes(updated);

                      if (value === "Dropdown" || value === "Radio") {
                        setselectedcolumnindex(idx);
                        setOptionstype(value);
                        setShowoptionmodel(true);
                      }
                    }}
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Email">Email</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Date">Date</option>
                    <option value="Telephone">Telephone</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Radio">Radio</option>
                    <option value="Password">Password</option>
                    <option value="Time">Time</option>
                    <option value="Color">Color</option>
                  </select>
                  <button
                    onClick={() => handleDeleteColumn(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white font-bold rounded-full h-4 w-4 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"

                    title="Delete Column"
                  >
                    &times;
                  </button>
                </th>
              ))}
              {showActions && (
                <th className="border-2 border-blue-900 p-2">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {table.columns.map((col, i) => (
                  <td key={i} className="border border-blue-900 p-2">
                    {editingRow === idx ? (
                      columnoptions[i] && columnTypes[i] === "Dropdown" ? (
                        <select
                          value={editedRow[col] || ""}
                          onChange={(e) => handlechangeeditedrow(col, e.target.value)}
                          className="w-full p-1 border border-black"
                        >
                          <option value="">Select</option>
                          {columnoptions[i].options.map((opt, index) => (
                            <option key={index} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : columnoptions[i] && columnTypes[i] === "Radio" ? (
                        <div className="flex flex-col">
                          {columnoptions[i].options.map((opt, index) => (
                            <label key={index} className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`edit-${col}`}
                                value={opt}
                                checked={editedRow[col] === opt}
                                onChange={(e) => handlechangeeditedrow(col, e.target.value)}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                        type={columnTypes[i]==="Date"?"date":columnTypes[i]==="Time"?"time":columnTypes[i]==="Color"?"color":"text"}
                        value={editedRow[col] || ""}
                        onChange={(e) => handlechangeeditedrow(col, e.target.value)}
                        className={`${
                        columnTypes[i]==="Color"
                        ?"w-full h-7 p-0 rounded-full cursor-pointer "
                        :"w-full p-2 border border-black"}`}
                      />
                      )
                    ) : (
                      row.rowData[col] || ""
                    )}
                  </td>
                ))}

                {showActions && (
                  <td className="border p-2">
                    {editingRow === idx ? (
                      <>
                        <button
                          onClick={() => handlesaverow(idx)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => seteditingRow(null)}
                          className="bg-blue-800 text-white px-3 py-1 rounded cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="">
                        <button
                          onClick={() => handleEditRow(idx)}
                          className="bg-blue-400 text-white px-3 py-1 rounded mr-2 cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handledetelerow(idx)}
                          className="bg-red-400 px-3 py-1 rounded text-white cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}

            {showActions && (
              <tr>
                {table.columns.map((col, idx) => (
                  <td key={idx}>
                    {columnoptions[idx] && columnTypes[idx] === "Dropdown" ? (
                      <select
                        value={newRow[col] || ""}
                        onChange={(e) => handleChangeNewRow(col, e.target.value)}
                        className="w-full p-1 border border-black"
                      >
                        <option value="">Select</option>
                        {columnoptions[idx].options.map((opt, index) => (
                          <option key={index} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : columnoptions[idx] && columnTypes[idx] === "Radio" ? (
                      <div className="flex flex-col">
                        {columnoptions[idx].options.map((opt, index) => (
                          <label key={index} className="flex items-center gap-1">
                            <input
                              type="radio"
                              name={`new-${col}`}
                              value={opt}
                              checked={newRow[col] === opt}
                              onChange={(e) => handleChangeNewRow(col, e.target.value)}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={columnTypes[idx]==="Date"?"date":columnTypes[idx]==="Time"?"time":columnTypes[idx]==="Color"?"color":"text"}
                        value={newRow[col] || ""}
                        onChange={(e) => handleChangeNewRow(col, e.target.value)}
                        className={`${
                        columnTypes[idx]==="Color"
                        ?"w-full h-7 p-0 rounded-full cursor-pointer "
                        :"w-full p-2 border border-black"}`}
                      />
                    )}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>

        {showActions && (
          <div className="flex justify-evenly mt-5 mx-8">
            <button
              onClick={handleAddRow}
              className="bg-blue-900 px-2 py-3 rounded text-white w-1/7 cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
            >
              + Add Row
            </button>
            <button
              className="bg-blue-900 px-2 py-3 rounded text-white w-1/7 cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
              onClick={handleAddColumn}
            >
              + Add Column
            </button>
            <button
              className="bg-green-900 px-2 py-3 rounded text-white w-1/7 cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
              onClick={handlesaveTable}
            >
              Save
            </button>
          </div>
        )}

        {showoptionmodel && (
          <div className="fixed inset-0 backdrop-blur-[5px] bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
              <h3 className="text-xl font-bold text-center">
                {optiontype} Options Configuration
              </h3>

              

              <div>
                <label className="font-semibold">Number of Options:</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={numoptions}
                  onChange={(e) => {
                    const n = parseInt(e.target.value);
                    setNumberoptions(n);
                    setOptions(Array(n).fill(""));
                  }}
                />
              </div>

              {options.map((opt, i) => (
                <div key={i}>
                  <label className="font-semibold">Option {i + 1}:</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i] = e.target.value;
                      setOptions(newOpts);
                    }}
                  />
                </div>
              ))}

              <div className="flex justify-end gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
                  onClick={() => setShowoptionmodel(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:scale-105 transition ease-in-out duration:1000"
                  onClick={() => {
                    setcolumnoptions((prev) => ({
                      ...prev,
                      [selectedcolumnindex]: {
                        boxName: boxname,
                        options,
                        type: optiontype,
                      },
                    }));
                    setShowoptionmodel(false);
                    setBoxname("");
                    setNumberoptions(0);
                    setOptions([]);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableView;
