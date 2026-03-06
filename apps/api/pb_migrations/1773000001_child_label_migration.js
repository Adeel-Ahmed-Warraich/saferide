/// <reference path="../pb_data/types.d.ts" />

// Migration: Add childLabel field to payments and income_records
// This allows tracking which child a fee/payment belongs to when a parent has multiple children

migrate((app) => {

  // ── 1. Add childLabel to payments ──────────────────────────────────────────
  try {
    const col = app.findCollectionByNameOrId("payments");
    if (!col.fields.getByName("childLabel")) {
      col.fields.add(new Field({
        type: "text",
        name: "childLabel",
        required: false,
      }));
      app.save(col);
      console.log("payments.childLabel added");
    } else {
      console.log("payments.childLabel already exists");
    }
  } catch (e) {
    console.error("payments childLabel migration failed:", e.message);
  }

  // ── 2. Add childLabel to income_records ────────────────────────────────────
  try {
    const col = app.findCollectionByNameOrId("income_records");
    if (!col.fields.getByName("childLabel")) {
      col.fields.add(new Field({
        type: "text",
        name: "childLabel",
        required: false,
      }));
      app.save(col);
      console.log("income_records.childLabel added");
    } else {
      console.log("income_records.childLabel already exists");
    }
  } catch (e) {
    console.error("income_records childLabel migration failed:", e.message);
  }

}, (app) => {
  // Rollback
  for (const colName of ["payments", "income_records"]) {
    try {
      const col = app.findCollectionByNameOrId(colName);
      const f = col.fields.getByName("childLabel");
      if (f) { col.fields.removeById(f.id); app.save(col); }
    } catch (e) {}
  }
});
