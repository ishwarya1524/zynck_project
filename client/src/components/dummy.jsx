import axios from "axios"
import {useState,useEffect} from "react"

function App(){
    const [tableName,setTableName]=useState('');
    const [columns,setColumns]=useState([''])
    const [table,setTable]=useState(null)
    const [rows,setRows]=useState([])
    const [newRow,setNewRow]=useState({});
    const [editingRow,seteditingRow]=useState({});
    const [editedRow,seteditedRow]=useState({});

    const handleCreateTable=async()=>{
        try{
            const res=await axios.post('http://localhost:5000/tables',{
                tableName,
                columns,
            });
            setTable(res.data);
        }
        catch(err){
            console.log("error creating table",err);
            alert("failed to create table")
            
        }
    };

    const handleAddRow=async() =>{
        if(!table || !table._id) return;

        const hasValues=Object.values(newRow).some(v=>v.trim()!=='');
        if(!hasValues){
            alert("fill at least one column");
            return;
        }

    try{
        const res=await axios.post(`http://localhost:5000/tables/${table._id}/rows`,newRow);
        setRows([...rows,res.data]);
        setNewRow({});
    }
    catch(err){
        console.error("Error adding row",err);
        alert("failed to add row:"+ (err.response?.data.error || "unknown error"))        
    }
    };

    const handleEditRow=(idx)=>{
      seteditingRow(idx);
      seteditedRow({...rows[idx].rowData});
    }

    const handlechangeeditedrow=(col,value)=>{
      seteditedRow((prev)=>({...prev,[col]:value}))
    }

    const handlesaverow=async(idx)=>{
      try{
        const rowId=rows[idx]._id;
        const res=await axios.put(
          `http://localhost:5000/tables/${table._id}/rows/${rowId}`,
          {rowData:editedRow}
        );
        const updataedRow=[...rows];
        updataedRow[idx]=res.data;
        setRows(updataedRow);
        seteditingRow(null);
      }
      catch(err){
        console.error("Error saving row",err);
        alert("Failed to save row")
      }
    }

    const handledetelerow= async(idx)=>{
      const rowId=rows[idx]._id;
      try{
        await axios.delete(`http://localhost:5000/tables/${table._id}/rows/${rowId}`);
        setRows(rows.filter((_,i)=>i!==idx));
      }
      catch(err){
        console.error("error deleting row",err);
        alert("failed to delete row")
        
      }
    }

    const handleChangeNewRow=(col,value)=>{
        setNewRow({...newRow,[col]:value});
    };
    useEffect(()=>{
        const fetchTableAndRows= async()=>{
            if(table && table._id){
                try{
                    const res=await axios.get(`http://localhost:5000/tables/${table._id}`);
                    setTable(res.data.table);
                    setRows(res.data.rows);
                }
                catch(err){
                    console.error("Error fetching rows",err);
                }
            }
        }
        fetchTableAndRows();
    },[table?._id]);
    if (!table) {
        return (
          <div className="min-h-screen flex  flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center border-2 w-1/2 rounded-md gap-3 shadow-lg">
            <h2 className="text-blue-500 text-2xl  font-bold mt-3">Create a Table</h2>
            <input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Table name" className="border-1 w-90 p-3 rounded-sm"
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
                  placeholder={`Column ${idx + 1}`} className="border-1 w-90 p-3 rounded-sm"
                />
              </div>
            ))}
            <button onClick={() => setColumns([...columns, ''])} className="border-2 w-90 p-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-500">+ Add Column</button>
            <br /><br />
            <button onClick={handleCreateTable} className="border-2 w-60 mb-5 p-3 rounded-sm bg-blue-200 hover:bg-blue-500 hover:rounded-full transition-all duration-500">Create Table</button>
          </div>
          </div>
        );
      }
    
      return (
        <div className="flex flex-col justify-center min-h-screen items-center overflow-x-auto mx-4">
          <div className="w-full flex flex-col gap-3 justify-evenly">
            <h2 className="text-blue-400 font-bold text-3xl mb-5 text-center">
              {table.tableName}
            </h2>
            <table className="table-auto border border-collapse w-full">
              <thead>
                <tr>
                  {table.columns.map((col, idx) => (
                    <th key={idx} className="border-2 border-blue-900 p-2">
                      {col}
                    </th>
                  ))}
                  <th className="border-2 border-blue-900 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    {table.columns.map((col, i) => (
                      <td key={i} className="border border-blue-900 p-2">
                        {editingRow === idx ? (
                          <input
                            value={editedRow[col] || ""}
                            onChange={(e) =>
                              handlechangeeditedrow(col, e.target.value)
                            }
                            className="w-full p-1 border border-black"
                          />
                        ) : (
                          row.rowData[col] || ""
                        )}
                      </td>
                    ))}
                    <td className="p-2">
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
                        <>
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
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  {table.columns.map((col, idx) => (
                    <td key={idx}>
                      <input
                        value={newRow[col] || ""}
                        onChange={(e) => handleChangeNewRow(col, e.target.value)}
                        className="w-full p-1 border border-black"
                        
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={handleAddRow}
                      className="bg-blue-900 px-3 py-1 rounded text-white"
                    >
                      + Add Row
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  
    
    export default App;
