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
  handleAddColumn,
  handlesaveTable,
  columnTypes,
  setColumnTypes,
  showActions = true,
}) => {
  const [showoptionmodel,setShowoptionmodel]=useState(false)
  const [selectedcolumnindex,setselectedcolumnindex]=useState(null);
  const [optiontype,setOptionstype]=useState("")
  const [boxname,setBoxname]=useState("")
  const [numoptions,setNumberoptions]=useState(0);
  const [options,setOptions]=useState([])
  const [columnoptions,setcolumnoptions]=useState({})

  return (
    <div className="flex flex-col justify-center min-h-screen items-center overflow-x-auto  w-full">
      <div className="w-full flex flex-col gap-3 justify-evenly">
        <h2 className="text-blue-400 font-bold text-3xl mb-5 text-center">
          {table.tableName}
        </h2>

        <table className="table-auto border border-collapse w-full bg-white">
          <thead>
            <tr>
              {table.columns.map((col, idx) => (
                <th key={idx} className="border-2 border-blue-900 p-2">
                  {col}
                  <select className=" rounded  ml-3 bg-gray-200 p-2" value={columnTypes[idx]} onChange={(e)=>{
                    const value=e.target.value
                    const updated=[...columnTypes];
                    updated[idx]=e.target.value;
                    setColumnTypes(updated);

                    if(value ==="Dropdown" || value==="Radio"){
                      setselectedcolumnindex(idx);
                      setOptionstype(value);
                      setShowoptionmodel(true);
                    }

                  }}>
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Email">Email</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Date">Date</option>
                    <option value="Telephone">Telephone</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Radio">Radio</option>
                    <option value="Password">Password</option>
                    <option value="">Time</option>
                  </select>
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
                      columnoptions[i] && (columnTypes[i] === "Dropdown" || columnTypes[i] === "Radio") ? (
                        <select value={editedRow[col] || ""} onChange={(e)=>handlechangeeditedrow(col,e.target.value)}
                          className="w-full p-1 border border-black"
                        >
                          <option value="">Select</option>
                          {columnoptions[i].options.map((opt,index)=>(
                            <option key={index} value={opt}>{opt}</option>
                          ))}
                        </select>
                    ) : (
                      <input value={editedRow[col] || ""} onChange={(e)=>handlechangeeditedrow(col,e.target.value)} className="w-full p-1 border border-black"/>
                    )):
                    (
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
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => seteditingRow(null)}
                          className="bg-blue-800 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="">
                        <button
                          onClick={() => handleEditRow(idx)}
                          className="bg-blue-400 text-white px-3 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handledetelerow(idx)}
                          className="bg-red-400 px-3 py-1 rounded text-white"
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
                    {columnoptions[idx] && (columnTypes[idx] === "Dropdown" || columnTypes[idx] === "Radio") ? (
                      <select
                        value={newRow[col] || ""}
                        onChange={(e) => handleChangeNewRow(col, e.target.value)}
                        className="w-full p-1 border border-black"
                      >
                        <option value="">Select</option>
                        {columnoptions[idx].options.map((opt, index) => (
                          <option key={index} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={newRow[col] || ""}
                        onChange={(e) => handleChangeNewRow(col, e.target.value)}
                        className="w-full p-1 border border-black"
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
              className="bg-blue-900 px-2 py-3 rounded text-white w-1/7 cursor-pointer"
            >
              + Add Row
            </button>
            <button
              className="bg-blue-900 px-2 py-3 rounded text-white w-1/7 cursor-pointer"
              onClick={handleAddColumn}
            >
              + Add Column
            </button>
            <button
              className="bg-green-900 px-2 py-3 rounded text-white w-1/7 cursor-pointer"
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
        <label className="font-semibold">Box Name:</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={boxname}
          onChange={(e) => setBoxname(e.target.value)}
        />
      </div>

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
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setShowoptionmodel(false)}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
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
