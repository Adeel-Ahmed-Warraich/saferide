/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("parents");
  collection.indexes.push("CREATE UNIQUE INDEX idx_parents_email ON parents (email) WHERE email != ''");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("parents");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_parents_email"));
  return app.save(collection);
})
