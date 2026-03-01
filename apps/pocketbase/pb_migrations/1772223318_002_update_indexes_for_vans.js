/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("vans");
  collection.indexes.push("CREATE UNIQUE INDEX idx_vans_vanId ON vans (vanId)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("vans");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_vans_vanId"));
  return app.save(collection);
})
