/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: "info@saferide.com.pk" }],
    subject: "New Enrollment Submission - " + e.record.get("childName"),
    html: "<h2>New Enrollment Form Submitted</h2>" +
          "<p><strong>Parent Name:</strong> " + e.record.get("parentName") + "</p>" +
          "<p><strong>Contact Number:</strong> " + e.record.get("contactNumber") + "</p>" +
          "<p><strong>Email:</strong> " + e.record.get("email") + "</p>" +
          "<p><strong>Child Name:</strong> " + e.record.get("childName") + "</p>" +
          "<p><strong>Child Class:</strong> " + e.record.get("childClass") + "</p>" +
          "<p><strong>School Name:</strong> " + e.record.get("schoolName") + "</p>" +
          "<p><strong>Home Address:</strong> " + e.record.get("homeAddress") + "</p>" +
          "<p><strong>Preferred Shift:</strong> " + e.record.get("preferredShift") + "</p>" +
          "<p><strong>Special Instructions:</strong> " + (e.record.get("specialInstructions") || "None") + "</p>" +
          "<p><strong>Submission ID:</strong> " + e.record.id + "</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "enrollments");