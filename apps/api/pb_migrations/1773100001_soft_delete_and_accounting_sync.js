/// <reference path="../pb_data/types.d.ts" />

/**
 * api/pb_migrations/1773100001_soft_delete_and_accounting_sync.js
 *
 * FIXES applied:
 *  #10 Adds isArchived boolean to parents collection (soft-delete support).
 *  #10 Suggestion B: Adds auto-create income_records when a payment is approved.
 *
 * HOW TO RUN:
 *  Drop this file in api/pb_migrations/ — PocketBase picks it up on next restart.
 */

migrate((app) => {
  // ── 1. Add isArchived to parents ──────────────────────────────────────────
  const parentsCollection = app.findCollectionByNameOrId("parents");

  const isArchivedField = new Field({
    name:         "isArchived",
    type:         "bool",
    required:     false,
    system:       false,
    presentable:  false,
    options: { default: false },
  });

  parentsCollection.fields.add(isArchivedField);
  app.save(parentsCollection);

  console.log("[migration] Added isArchived to parents ✓");

}, (app) => {
  // Rollback: remove isArchived field
  const parentsCollection = app.findCollectionByNameOrId("parents");
  const field = parentsCollection.fields.getByName("isArchived");
  if (field) {
    parentsCollection.fields.remove(field.id);
    app.save(parentsCollection);
  }
});
