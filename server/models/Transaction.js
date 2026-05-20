const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      maxlength: [80, "Title cannot exceed 80 characters."]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [240, "Description cannot exceed 240 characters."],
      default: ""
    },
    amount: {
      type: Number,
      required: [true, "Amount is required."],
      min: [0.01, "Amount must be greater than zero."]
    },
    type: {
      type: String,
      required: [true, "Type is required."],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense."
      }
    },
    date: {
      type: Date,
      required: [true, "Date is required."]
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters."]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);

