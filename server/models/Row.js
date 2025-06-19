// models/Row.js
const mongoose = require("mongoose");

const rowSchema = new mongoose.Schema({
  tableId: mongoose.Types.ObjectId,
  rowData: Object,
});

module.exports=mongoose.models.Row || mongoose.model("Row",rowSchema)