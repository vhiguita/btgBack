const mongoose = require("mongoose");

const fundSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["FPV", "FIC"] },
  minimumAmount: { type: Number, required: true, min: 50000 }, // Basado en los montos mínimos dados,
  //fechaCreacion: { type: Date, default: Date.now },
});

const Fund = mongoose.model("Fund", fundSchema);
module.exports = Fund