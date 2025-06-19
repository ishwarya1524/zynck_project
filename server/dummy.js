const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.mongouri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.log("❌ Mongoose connection error:", err));

const tableSchema = new mongoose.Schema({
  tableName: String,
  columns: [String],
});

const rowSchema = new mongoose.Schema({
  tableId: mongoose.Types.ObjectId,
  rowData: Object,
});

const Table = mongoose.model('Table', tableSchema);
const Row = mongoose.model('Row', rowSchema);

// ✅ Create Table
app.post('/tables', async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Table with Rows
app.get('/tables/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    const rows = await Row.find({ tableId: req.params.id });
    res.json({ table, rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add Row
app.post('/tables/:id/rows', async (req, res) => {
  try {
    const row = new Row({ 
      tableId: new mongoose.Types.ObjectId(req.params.id), 
      rowData: req.body 
    });
    await row.save();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
