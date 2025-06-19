const express = require("express");
const router = express.Router();
const Table = require("../models/Table");
const Row=require("../models/Row")
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create a new table
router.post("/table", authMiddleware, async (req, res) => {
  try {
    const { tableName, columns } = req.body;

    const table = await Table.create({
      tableName,
      columns,
      rows: [],
      user: req.userId, // From middleware
    });

    res.json(table);
    console.log("Table created successfully!")
  } catch (err) {
    res.status(500).json({ error: "Failed to create table" });
  }
});

//  Get all tables of a logged-in user
router.get("/tables", authMiddleware, async (req, res) => {
  try {
    const tables = await Table.find({ user: req.userId });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tables" });
  }
});

// ✅ Update table details
router.put("/table/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Table.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Table not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update table" });
  }
});

// ✅ Delete a table
router.delete("/table/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Table.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Table not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete table" });
  }
});

//ADD row
router.post('/tables/:id/rows',async(req,res)=>{
    try{
        const row=new Row({
            tableId:req.params.id,
            rowData:req.body,
        });
        await row.save();
        res.status(201).json({
          _id:row._id,
          rowData:row.rowData,
        }
        );
    }
    catch(err){
      console.error("Error in /tables/:id/rows:", err.message);
      res.status(500).json({ error: err.message });
    }
});

router.put("/tables/:tableId/rows/:rowId",async(req,res)=>{
  try{
      const updatedRow=await Row.findByIdAndUpdate(
          req.params.rowId,
          {rowData:req.body.rowData},
          {new:true}
      );
      res.json(updatedRow)
  }
  catch(err){
      res.status(500).json({error:err.message});
  }
});


//Saving entire Table
router.put("/table/:id",authMiddleware,async(req,res)=>{
    try{
        const updated=await Table.findOneAndUpdate(
            {_id:req.params.id,user:req.userId},
            req.body,
            {new:true}
        );
        if(!updated){
            return res.status(404).json({error:"Table not found"})
        }
        res.json(updated);
    }
    catch(err){
        res.status(500).json({error:"failed to update table"})
    }
})

router.get("/table/:id",authMiddleware,async(req,res)=>{
  console.log("Route hit!");
  console.log("User ID:", req.userId);
  console.log("Table ID:", req.params.id);
  try{
    const table=await Table.findOne({
      _id:req.params.id,
      user:req.userId
    })

    if(!table){
      return res.status(404).json({error:"Table not found"});
    }
    const rows=await Row.find({tableId:table._id});
    return res.json({...table.toObject(),rows});
  }
  catch(err){
    console.error("GET/table/:id error",err);
    res.status(500).json({error:"server error"});
  }
})
router.delete("/tables/:tableId/rows/:rowId",async(req,res)=>{
  try{
      await Row.findByIdAndDelete(req.params.rowId);
      res.json({message:"row deleted Successfully"});
  }
  catch(err){
      res.status(500).json({error:err.message})
  }
})

router.delete('/tables/:id',async(req,res)=>{
  try{
    const table=await Table.findByIdAndDelete(req.params.id);
    if(!table) return res.status(404).json({error:"Table Not found"});
    res.json({message:"Table deleted successfully"});
  }
  catch(err){
    res.status(500).json({error:"server error"})
  }
})

module.exports = router;
