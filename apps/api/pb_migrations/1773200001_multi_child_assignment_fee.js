/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Multi-child per-child assignment, fee, and joining date support
 *
 * WHAT THIS ADDS
 * ──────────────
 * assignments collection:
 *   • childLabel   (text)   — which child this assignment covers
 *   • monthlyFee   (number) — fee specific to this child/van/route
 *   • joiningDate  (date)   — when this child started service
 *   • notes        (text)   — admin notes (e.g. "discount applied")
 *
 * parents collection:
 *   • monthlyFee   (number) — primary child's monthly fee (set by admin on approval)
 *   • joiningDate  (date)   — primary child's service start date
 *
 * enrollments collection:
 *   • suggestedFee (number) — admin can pre-fill fee during enrollment review
 *   • suggestedVan (text)   — admin can note van preference during review
 */

migrate((app) => {

  // ── 1. assignments: add childLabel, monthlyFee, joiningDate, notes ─────────
  try {
    const col = app.findCollectionByNameOrId("assignments");

    const toAdd = [
      { name: "childLabel",  type: "text",   required: false },
      { name: "monthlyFee",  type: "number", required: false },
      { name: "joiningDate", type: "date",   required: false },
      { name: "notes",       type: "text",   required: false },
    ];

    let changed = false;
    for (const f of toAdd) {
      if (!col.fields.getByName(f.name)) {
        col.fields.add(new Field({ type: f.type, name: f.name, required: f.required }));
        changed = true;
        console.log(`assignments.${f.name} added ✓`);
      } else {
        console.log(`assignments.${f.name} already exists — skipping`);
      }
    }
    if (changed) app.save(col);
  } catch (e) {
    console.error("assignments migration failed:", e.message);
    throw e;
  }

  // ── 2. parents: add monthlyFee, joiningDate ────────────────────────────────
  try {
    const col = app.findCollectionByNameOrId("parents");

    const toAdd = [
      { name: "monthlyFee",  type: "number", required: false },
      { name: "joiningDate", type: "date",   required: false },
    ];

    let changed = false;
    for (const f of toAdd) {
      if (!col.fields.getByName(f.name)) {
        col.fields.add(new Field({ type: f.type, name: f.name, required: f.required }));
        changed = true;
        console.log(`parents.${f.name} added ✓`);
      } else {
        console.log(`parents.${f.name} already exists — skipping`);
      }
    }
    if (changed) app.save(col);
  } catch (e) {
    console.error("parents migration failed:", e.message);
    throw e;
  }

  // ── 3. enrollments: add suggestedFee, suggestedVan ─────────────────────────
  try {
    const col = app.findCollectionByNameOrId("enrollments");

    const toAdd = [
      { name: "suggestedFee", type: "number", required: false },
      { name: "suggestedVan", type: "text",   required: false },
    ];

    let changed = false;
    for (const f of toAdd) {
      if (!col.fields.getByName(f.name)) {
        col.fields.add(new Field({ type: f.type, name: f.name, required: f.required }));
        changed = true;
        console.log(`enrollments.${f.name} added ✓`);
      } else {
        console.log(`enrollments.${f.name} already exists — skipping`);
      }
    }
    if (changed) app.save(col);
  } catch (e) {
    console.error("enrollments migration failed:", e.message);
    throw e;
  }

}, (app) => {
  // Rollback
  const rollback = [
    { col: "assignments",  fields: ["childLabel", "monthlyFee", "joiningDate", "notes"] },
    { col: "parents",      fields: ["monthlyFee", "joiningDate"] },
    { col: "enrollments",  fields: ["suggestedFee", "suggestedVan"] },
  ];

  for (const { col: colName, fields } of rollback) {
    try {
      const col = app.findCollectionByNameOrId(colName);
      let changed = false;
      for (const name of fields) {
        const f = col.fields.getByName(name);
        if (f) { col.fields.removeById(f.id); changed = true; }
      }
      if (changed) app.save(col);
    } catch (e) {
      console.log(`Rollback skipped for ${colName}:`, e.message);
    }
  }
});
