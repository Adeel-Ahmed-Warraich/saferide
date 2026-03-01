/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {

  // ── income_records ────────────────────────────────────────────────────────
  const income = new Collection({
    type: "base",
    name: "income_records",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      { type: "text", name: "parentId", required: false },
      { type: "select", name: "type", required: true, maxSelect: 1,
        values: ["Monthly Fee", "Advance Fee", "Registration Fee", "Security Deposit", "Late Payment Fine", "Other"] },
      { type: "number", name: "amount", required: true },
      { type: "text", name: "month", required: false },
      { type: "select", name: "paymentMethod", required: false, maxSelect: 1,
        values: ["Cash", "Easypaisa", "JazzCash", "Bank Transfer", "Cheque"] },
      { type: "text", name: "receivedDate", required: false },
      { type: "select", name: "status", required: true, maxSelect: 1,
        values: ["Received", "Pending", "Partial", "Waived"] },
      { type: "text", name: "notes", required: false },
    ],
  });

  try {
    app.save(income);
  } catch (e) {
    if (e.message.includes("Collection name must be unique")) {
      console.log("income_records already exists, skipping");
      return;
    }
    throw e;
  }

  // ── vehicle_expenses ──────────────────────────────────────────────────────
  const expenses = new Collection({
    type: "base",
    name: "vehicle_expenses",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      { type: "text", name: "vanId", required: false },
      { type: "select", name: "category", required: true, maxSelect: 1,
        values: ["Fuel", "Maintenance", "Repair", "Insurance", "Toll/Parking", "Cleaning", "Tyres", "Driver Salary", "Other"] },
      { type: "number", name: "amount", required: true },
      { type: "text", name: "description", required: false },
      { type: "text", name: "expenseDate", required: false },
      { type: "text", name: "vendor", required: false },
      { type: "text", name: "receiptNo", required: false },
      { type: "text", name: "notes", required: false },
    ],
  });

  try {
    app.save(expenses);
  } catch (e) {
    if (e.message.includes("Collection name must be unique")) {
      console.log("vehicle_expenses already exists, skipping");
    } else {
      throw e;
    }
  }

}, (app) => {
  // Revert
  for (const name of ["income_records", "vehicle_expenses"]) {
    try {
      app.delete(app.findCollectionByNameOrId(name));
    } catch (e) {
      console.log(`Could not revert ${name}:`, e.message);
    }
  }
});