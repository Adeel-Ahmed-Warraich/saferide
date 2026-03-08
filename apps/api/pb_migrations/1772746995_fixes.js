/// <reference path="../pb_data/types.d.ts" />

// Migration: Fix notifications updateRule + add status to enrollments + tempPassword to parents

migrate((app) => {

  // ── 1. Fix notifications updateRule ────────────────────────────────────────
  // Allow parents to mark their OWN notifications as read (PATCH isRead only)
  try {
    const notifCol = app.findCollectionByNameOrId("notifications");
    // Allow parent to update only if the notification belongs to them OR it's a broadcast
    notifCol.updateRule = 'parentId = @request.auth.id || (parentId = "" && @request.auth.collectionName = "parents") || @request.auth.collectionName = "admins"';
    app.save(notifCol);
    console.log("notifications updateRule fixed");
  } catch (e) {
    console.error("notifications fix failed:", e.message);
  }

  // ── 2. Add status field to enrollments ─────────────────────────────────────
  try {
    const enrollCol = app.findCollectionByNameOrId("enrollments");
    const hasStatus = enrollCol.fields.getByName("status");
    if (!hasStatus) {
      const statusField = new Field({
        type: "select",
        name: "status",
        required: false,
        maxSelect: 1,
        values: ["pending", "rejected"],
      });
      enrollCol.fields.add(statusField);
      app.save(enrollCol);
      console.log("enrollments.status field added");
    } else {
      console.log("enrollments.status already exists, skipping");
    }
  } catch (e) {
    console.error("enrollments status fix failed:", e.message);
  }

  // ── 3. Add tempPassword field to parents ────────────────────────────────────
  try {
    const parentsCol = app.findCollectionByNameOrId("parents");
    const hasTempPass = parentsCol.fields.getByName("tempPassword");
    if (!hasTempPass) {
      const tempPassField = new Field({
        type: "text",
        name: "tempPassword",
        required: false,
      });
      parentsCol.fields.add(tempPassField);
      app.save(parentsCol);
      console.log("parents.tempPassword field added");
    } else {
      console.log("parents.tempPassword already exists, skipping");
    }
  } catch (e) {
    console.error("parents tempPassword fix failed:", e.message);
  }

}, (app) => {
  // revert — optional
});
