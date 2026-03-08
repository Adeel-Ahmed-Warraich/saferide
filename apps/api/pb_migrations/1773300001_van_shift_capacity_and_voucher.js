/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Per-shift capacity on vans + fee voucher fields on payments
 *
 * VANS — split single `capacity` into two independent shift seats:
 *   morningCapacity   (number) — max students on this van for the morning shift
 *   afternoonCapacity (number) — max students on this van for the afternoon shift
 *   The old `capacity` field is kept for now so existing data is not lost.
 *   Admin can migrate values manually or leave old field as a fallback.
 *
 * PAYMENTS — add fee-voucher fields so the auto-generated advance-fee
 *   payment record carries everything the parent needs to pay:
 *   voucherNumber  (text)   — human-readable e.g. "INV-2025-0001"
 *   voucherType    (select) — "Advance" | "Monthly" | "Arrears"
 *   dueDate already exists — used as the payment deadline
 *   month          already exists — the period this voucher covers
 */

migrate((app) => {

  // ── 1. vans: add morningCapacity, afternoonCapacity ───────────────────────
  try {
    const col = app.findCollectionByNameOrId("vans");

    const toAdd = [
      { name: "morningCapacity",   type: "number", required: false },
      { name: "afternoonCapacity", type: "number", required: false },
    ];

    let changed = false;
    for (const f of toAdd) {
      if (!col.fields.getByName(f.name)) {
        col.fields.add(new Field({ type: f.type, name: f.name, required: f.required }));
        changed = true;
        console.log(`vans.${f.name} added ✓`);
      } else {
        console.log(`vans.${f.name} already exists — skipping`);
      }
    }
    if (changed) app.save(col);
  } catch (e) {
    console.error("vans migration failed:", e.message);
    throw e;
  }

  // ── 2. payments: add voucherNumber, voucherType ───────────────────────────
  try {
    const col = app.findCollectionByNameOrId("payments");

    if (!col.fields.getByName("voucherNumber")) {
      col.fields.add(new Field({ type: "text",   name: "voucherNumber", required: false }));
      console.log("payments.voucherNumber added ✓");
    }
    if (!col.fields.getByName("voucherType")) {
      col.fields.add(new Field({
        type: "select", name: "voucherType", required: false,
        values: ["Advance", "Monthly", "Arrears"],
        maxSelect: 1,
      }));
      console.log("payments.voucherType added ✓");
    }

    app.save(col);
  } catch (e) {
    console.error("payments migration failed:", e.message);
    throw e;
  }

}, (app) => {
  // Rollback
  try {
    const vans = app.findCollectionByNameOrId("vans");
    for (const name of ["morningCapacity", "afternoonCapacity"]) {
      const f = vans.fields.getByName(name);
      if (f) vans.fields.removeById(f.id);
    }
    app.save(vans);
  } catch (e) { console.log("Rollback vans skipped:", e.message); }

  try {
    const pay = app.findCollectionByNameOrId("payments");
    for (const name of ["voucherNumber", "voucherType"]) {
      const f = pay.fields.getByName(name);
      if (f) pay.fields.removeById(f.id);
    }
    app.save(pay);
  } catch (e) { console.log("Rollback payments skipped:", e.message); }
});
