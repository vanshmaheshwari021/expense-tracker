const express = require("express");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const router = express.Router();

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateTransactionPayload = (payload) => {
  const title = normalizeText(payload.title);
  const description = normalizeText(payload.description);
  const category = normalizeText(payload.category) || "General";
  const type = normalizeText(payload.type).toLowerCase();
  const amount = Number(payload.amount);
  const parsedDate = new Date(payload.date);
  const errors = [];

  if (!title) {
    errors.push("Title is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push("Amount must be greater than zero.");
  }

  if (!["income", "expense"].includes(type)) {
    errors.push("Type must be income or expense.");
  }

  if (Number.isNaN(parsedDate.getTime())) {
    errors.push("A valid date is required.");
  }

  if (!category) {
    errors.push("Category is required.");
  }

  return {
    errors,
    value: {
      title,
      description,
      category,
      type,
      amount,
      date: parsedDate
    }
  };
};

const buildTransactionQuery = (query) => {
  const filters = {};
  const search = normalizeText(query.search);
  const type = normalizeText(query.type).toLowerCase();
  const category = normalizeText(query.category);
  const startDate = normalizeText(query.startDate);
  const endDate = normalizeText(query.endDate);

  if (search) {
    const searchPattern = escapeRegex(search);
    filters.$or = [
      { title: { $regex: searchPattern, $options: "i" } },
      { description: { $regex: searchPattern, $options: "i" } }
    ];
  }

  if (["income", "expense"].includes(type)) {
    filters.type = type;
  }

  if (category) {
    filters.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
  }

  if (startDate || endDate) {
    filters.date = {};

    if (startDate) {
      const parsedStart = new Date(startDate);
      if (!Number.isNaN(parsedStart.getTime())) {
        filters.date.$gte = parsedStart;
      }
    }

    if (endDate) {
      const parsedEnd = new Date(endDate);
      if (!Number.isNaN(parsedEnd.getTime())) {
        parsedEnd.setHours(23, 59, 59, 999);
        filters.date.$lte = parsedEnd;
      }
    }

    if (!Object.keys(filters.date).length) {
      delete filters.date;
    }
  }

  return filters;
};

router.get("/stats", async (req, res) => {
  try {
    const filters = buildTransactionQuery(req.query);
    const summary = await Transaction.aggregate([
      { $match: filters },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransactions = 0;

    summary.forEach((item) => {
      totalTransactions += item.count;

      if (item._id === "income") {
        totalIncome = item.total;
      }

      if (item._id === "expense") {
        totalExpense = item.total;
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalTransactions
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transaction stats." });
  }
});

router.get("/", async (req, res) => {
  try {
    const filters = buildTransactionQuery(req.query);
    const transactions = await Transaction.find(filters).sort({
      date: -1,
      createdAt: -1
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions." });
  }
});

router.post("/", async (req, res) => {
  const { errors, value } = validateTransactionPayload(req.body);

  if (errors.length) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  try {
    const transaction = await Transaction.create(value);
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create transaction." });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid transaction ID." });
  }

  const { errors, value } = validateTransactionPayload(req.body);

  if (errors.length) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  try {
    const transaction = await Transaction.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update transaction." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid transaction ID." });
  }

  try {
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    return res.json({ message: "Transaction deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete transaction." });
  }
});

module.exports = router;
