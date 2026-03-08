/// <reference path="../pb_data/types.d.ts" />
/**
 * 1773400002_batch3_safe_rollback.js
 *
 * EMERGENCY: If 1773400001_batch3_fixes.js crashed PocketBase on startup,
 * deploy THIS file (rename to a higher timestamp than the broken one).
 *
 * This migration is purely additive + defensive — it will not throw even if
 * the fields already exist or don't exist.
 *
 * HOW TO USE:
 * 1. Delete  api/pb_migrations/1773400001_batch3_fixes.js  from the server
 * 2. Upload  this file as                                  1773400002_batch3_safe_rollback.js
 * 3. Restart PocketBase — it will run only this migration
 * 4. Admin UI should recover
 */

migrate((app) => {

  // ── 1. payments.status → add "Rejected" safely ───────────────────────────
  try {
    var paymentsCol = app.findCollectionByNameOrId("payments");
    // Iterate fields the old-school way for maximum PB version compatibility
    var statusField = null;
    for (var i = 0; i < paymentsCol.fields.length; i++) {
      if (paymentsCol.fields[i].name === "status") {
        statusField = paymentsCol.fields[i];
        break;
      }
    }
    if (statusField && statusField.values) {
      var vals = statusField.values;
      var hasRejected = false;
      for (var j = 0; j < vals.length; j++) {
        if (vals[j] === "Rejected") { hasRejected = true; break; }
      }
      if (!hasRejected) {
        statusField.values.push("Rejected");
        app.save(paymentsCol);
        console.log("[emergency] payments.status: Rejected added");
      } else {
        console.log("[emergency] payments.status: Rejected already present");
      }
    }
  } catch (e) {
    // Log but don't throw — we want PB to start even if this fails
    console.error("[emergency] payments status skip:", e.message);
  }

  // ── 2. notifications.expiresAt → add safely ───────────────────────────────
  try {
    var notifCol = app.findCollectionByNameOrId("notifications");
    var hasExpiry = false;
    for (var k = 0; k < notifCol.fields.length; k++) {
      if (notifCol.fields[k].name === "expiresAt") { hasExpiry = true; break; }
    }
    if (!hasExpiry) {
      notifCol.fields.add(new Field({ type: "date", name: "expiresAt", required: false }));
      app.save(notifCol);
      console.log("[emergency] notifications.expiresAt added");
    } else {
      console.log("[emergency] notifications.expiresAt already exists");
    }
  } catch (e) {
    console.error("[emergency] notifications.expiresAt skip:", e.message);
  }

  // ── 3. assignments: previousFee, effectiveFrom, feeHistory ───────────────
  try {
    var assignCol = app.findCollectionByNameOrId("assignments");
    var existingNames = {};
    for (var m = 0; m < assignCol.fields.length; m++) {
      existingNames[assignCol.fields[m].name] = true;
    }
    var changed = false;
    if (!existingNames["previousFee"]) {
      assignCol.fields.add(new Field({ type: "number", name: "previousFee", required: false }));
      changed = true;
    }
    if (!existingNames["effectiveFrom"]) {
      assignCol.fields.add(new Field({ type: "date", name: "effectiveFrom", required: false }));
      changed = true;
    }
    if (!existingNames["feeHistory"]) {
      assignCol.fields.add(new Field({ type: "json", name: "feeHistory", required: false }));
      changed = true;
    }
    if (changed) {
      app.save(assignCol);
      console.log("[emergency] assignments fee fields added");
    } else {
      console.log("[emergency] assignments fee fields already exist");
    }
  } catch (e) {
    console.error("[emergency] assignments fee fields skip:", e.message);
  }

  console.log("[emergency] batch3 safe migration complete");

}, (app) => {
  // No-op rollback — fields are optional, leave them
  console.log("[emergency] rollback no-op");
});
