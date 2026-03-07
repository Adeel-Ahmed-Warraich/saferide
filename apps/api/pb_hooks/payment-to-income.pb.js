/// <reference path="../pb_data/types.d.ts" />

/**
 * api/pb_hooks/payment-to-income.pb.js
 *
 * SUGGESTION B implemented:
 *  When a payment status changes to "Paid", automatically create a matching
 *  income_records entry so the Accounting page stays in sync without manual
 *  admin entry.
 *
 * Architecture notes:
 *  - All variables declared inside the callback (PocketBase hook scope isolation).
 *  - Idempotent: checks for existing income record for this payment before creating.
 *  - Does NOT run on create — only on update where status becomes "Paid".
 */

onRecordAfterUpdateSuccess((e) => {

  // Only trigger on payment status becoming "Paid"
  var newStatus = e.record.get("status") || "";
  if (newStatus !== "Paid") { e.next(); return; }

  var paymentId = e.record.id;
  var parentId  = e.record.get("parentId") || "";
  var amount    = e.record.get("amount")   || 0;
  var method    = e.record.get("paymentMethod") || "Cash";
  var month     = e.record.get("month")    || "";
  var childLabel = e.record.get("childLabel") || "";
  var today     = new Date().toISOString().split("T")[0];

  // Idempotency: avoid duplicate income records if hook fires twice
  try {
    var existing = $app.findFirstRecordByFilter(
      "income_records",
      'notes ~ "' + paymentId + '"',
    );
    if (existing) {
      console.log("[payment-to-income] Income record already exists for payment " + paymentId + " — skipping.");
      e.next(); return;
    }
  } catch (_) {
    // findFirstRecordByFilter throws if no record found — that's expected, continue
  }

  // Look up parent for name
  var parentName = "";
  try {
    var parent = $app.findRecordById("parents", parentId);
    parentName = parent.get("fullName") || parent.get("name") || "";
    // If no childLabel on payment, use parent's primary child
    if (!childLabel) {
      childLabel = parent.get("childName") || "";
    }
  } catch (err) {
    console.warn("[payment-to-income] Could not fetch parent:", err.message);
  }

  // Create the income_records entry
  try {
    var incomeCollection = $app.findCollectionByNameOrId("income_records");
    var record = new Record(incomeCollection);
    record.set("parentId",      parentId);
    record.set("childLabel",    childLabel);
    record.set("type",          "Monthly Fee");
    record.set("amount",        amount);
    record.set("month",         month);
    record.set("paymentMethod", method);
    record.set("receivedDate",  today);
    record.set("status",        "Received");
    record.set("notes",         "Auto-created from payment " + paymentId + (parentName ? " (" + parentName + ")" : ""));
    $app.save(record);
    console.log("[payment-to-income] Income record created for payment " + paymentId + " ✓");
  } catch (err) {
    console.error("[payment-to-income] Failed to create income record:", err.message);
  }

  e.next();
}, "payments");
