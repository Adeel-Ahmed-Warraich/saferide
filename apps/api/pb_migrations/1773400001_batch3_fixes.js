/// <reference path="../pb_data/types.d.ts" />
/**
 * 1773400001_batch3_fixes.js
 *
 * Fix #1  payments.status  — add "Rejected" (was missing → caused 400 on reject)
 * Fix #8  notifications.expiresAt — date field so admin can set expiry
 * Fix #5  assignments — previousFee, effectiveFrom, feeHistory for fee increases
 */
migrate((app) => {

  // 1. payments.status → add "Rejected"
  try {
    const col = app.findCollectionByNameOrId("payments");
    const f   = col.fields.getByName("status");
    if (f && Array.isArray(f.values) && !f.values.includes("Rejected")) {
      f.values.push("Rejected");
      app.save(col);
      console.log("[batch3] payments.status: Rejected added ✓");
    } else {
      console.log("[batch3] payments.status: Rejected already present");
    }
  } catch (e) { console.error("[batch3] payments status:", e.message); throw e; }

  // 2. notifications.expiresAt
  try {
    const col = app.findCollectionByNameOrId("notifications");
    if (!col.fields.getByName("expiresAt")) {
      col.fields.add(new Field({ type: "date", name: "expiresAt", required: false }));
      app.save(col);
      console.log("[batch3] notifications.expiresAt ✓");
    }
  } catch (e) { console.error("[batch3] notifications.expiresAt:", e.message); throw e; }

  // 3. assignments fee-increase tracking
  try {
    const col = app.findCollectionByNameOrId("assignments");
    const toAdd = [
      { name: "previousFee",   type: "number" },
      { name: "effectiveFrom", type: "date"   },
      { name: "feeHistory",    type: "json"   },
    ];
    let changed = false;
    for (const fd of toAdd) {
      if (!col.fields.getByName(fd.name)) {
        col.fields.add(new Field({ type: fd.type, name: fd.name, required: false }));
        changed = true;
        console.log(`[batch3] assignments.${fd.name} ✓`);
      }
    }
    if (changed) app.save(col);
  } catch (e) { console.error("[batch3] assignments fee history:", e.message); throw e; }

}, (app) => {
  try {
    const col = app.findCollectionByNameOrId("notifications");
    const f   = col.fields.getByName("expiresAt");
    if (f) { col.fields.removeById(f.id); app.save(col); }
  } catch (_) {}
  try {
    const col = app.findCollectionByNameOrId("assignments");
    for (const n of ["previousFee","effectiveFrom","feeHistory"]) {
      const f = col.fields.getByName(n);
      if (f) col.fields.removeById(f.id);
    }
    app.save(col);
  } catch (_) {}
});
