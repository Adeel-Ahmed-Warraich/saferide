/// <reference path="../pb_data/types.d.ts" />

// Create notification_reads collection — tracks read status per parent per notification
// This allows broadcast notifications to be marked read independently by each parent

migrate((app) => {
  const parentsCol = app.findCollectionByNameOrId("parents");
  const notifCol   = app.findCollectionByNameOrId("notifications");

  const collection = new Collection({
    name: "notification_reads",
    type: "base",
    // Parent can create/list/view their own reads. Admin can do everything.
    createRule: "@request.auth.collectionName = 'parents'",
    listRule:   "@request.auth.collectionName = 'admins' || parentId = @request.auth.id",
    viewRule:   "@request.auth.collectionName = 'admins' || parentId = @request.auth.id",
    updateRule: "@request.auth.collectionName = 'admins' || parentId = @request.auth.id",
    deleteRule: "@request.auth.collectionName = 'admins' || parentId = @request.auth.id",
    fields: [
      {
        type: "relation",
        name: "parentId",
        required: true,
        collectionId: parentsCol.id,
        maxSelect: 1,
        cascadeDelete: true,
      },
      {
        type: "relation",
        name: "notificationId",
        required: true,
        collectionId: notifCol.id,
        maxSelect: 1,
        cascadeDelete: true,
      },
    ],
    indexes: [
      // Unique constraint: one read record per parent per notification
      "CREATE UNIQUE INDEX idx_notif_reads_unique ON notification_reads (parentId, notificationId)",
    ],
  });

  try {
    app.save(collection);
    console.log("notification_reads collection created");
  } catch (e) {
    if (e.message.includes("already exists") || e.message.includes("unique")) {
      console.log("notification_reads already exists, skipping");
    } else {
      throw e;
    }
  }

}, (app) => {
  try {
    const col = app.findCollectionByNameOrId("notification_reads");
    app.delete(col);
  } catch (e) {}
});
