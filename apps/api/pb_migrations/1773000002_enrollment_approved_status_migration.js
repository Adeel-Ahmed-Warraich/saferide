/// <reference path="../pb_data/types.d.ts" />

// Migration: Add "approved" value to enrollments.status select field
migrate((app) => {
  try {
    const col = app.findCollectionByNameOrId("enrollments");
    const statusField = col.fields.getByName("status");

    if (!statusField) {
      // Create it fresh with all 3 values
      col.fields.add(new Field({
        type: "select",
        name: "status",
        required: false,
        maxSelect: 1,
        values: ["pending", "approved", "rejected"],
      }));
      console.log("enrollments.status field created with pending/approved/rejected");
    } else {
      // Add "approved" if missing
      const vals = statusField.values || [];
      if (!vals.includes("approved")) {
        statusField.values = [...vals, "approved"];
        console.log("enrollments.status: added 'approved' value");
      } else {
        console.log("enrollments.status: 'approved' already exists, skipping");
      }
    }

    app.save(col);
  } catch (e) {
    console.error("enrollment_approved_status migration failed:", e.message);
  }
}, (app) => {
  // Rollback: remove "approved" from values
  try {
    const col = app.findCollectionByNameOrId("enrollments");
    const statusField = col.fields.getByName("status");
    if (statusField) {
      statusField.values = (statusField.values || []).filter(v => v !== "approved");
      app.save(col);
    }
  } catch (e) {}
});
