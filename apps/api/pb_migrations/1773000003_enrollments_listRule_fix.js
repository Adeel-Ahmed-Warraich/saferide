/// <reference path="../pb_data/types.d.ts" />

// Fix enrollments listRule + viewRule to allow parents to read their own pending enrollments
// A parent can see enrollments where the email matches their own email

migrate((app) => {
  try {
    const col = app.findCollectionByNameOrId("enrollments");
    // Allow parents to list/view enrollments that match their email
    col.listRule = "@request.auth.collectionName = 'admins' || (email = @request.auth.email && @request.auth.collectionName = 'parents')";
    col.viewRule = "@request.auth.collectionName = 'admins' || (email = @request.auth.email && @request.auth.collectionName = 'parents')";
    app.save(col);
    console.log("enrollments listRule/viewRule fixed — parents can now read their own pending enrollments");
  } catch (e) {
    console.error("enrollments rule fix failed:", e.message);
  }
}, (app) => {
  try {
    const col = app.findCollectionByNameOrId("enrollments");
    col.listRule = "@request.auth.collectionName = 'admins'";
    col.viewRule = "@request.auth.collectionName = 'admins'";
    app.save(col);
  } catch (e) {}
});
