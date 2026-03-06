/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {

  function cfg() {
    return {
      name:       "SafeRide School Transport",
      phone:      "+92 300 XXXXXXX",
      whatsapp:   "923001234567",
      email:      "support@saferide.com.pk",
      website:    "https://saferide.com.pk",
      address:    "Lake City, Lahore, Pakistan",
      portalUrl:  "https://saferide.com.pk/login",
      adminEmail: "support@saferide.com.pk",
      pbAdmin:    "https://mediumspringgreen-otter-820696.hostingersite.com/_/#/collections",
    };
  }
  function hdr(title, sub, bg) {
    bg = bg || "#1e40af";
    var s = sub ? '<p style="color:#bfdbfe;margin:6px 0 0;font-size:14px;">' + sub + '</p>' : "";
    return '<div style="background:' + bg + ';padding:28px 24px;border-radius:10px 10px 0 0;"><h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">' + title + '</h2>' + s + '</div>';
  }
  function ftr() {
    var c = cfg();
    return '<div style="background:#f8fafc;padding:16px;text-align:center;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;"><p style="margin:0 0 5px;color:#64748b;font-size:12px;">📞 ' + c.phone + ' &nbsp;·&nbsp; 📧 ' + c.email + '</p><p style="margin:0;color:#94a3b8;font-size:11px;">' + c.name + ' · ' + c.address + '</p></div>';
  }
  function ctc() {
    var c = cfg();
    return '<div style="background:#dbeafe;border-left:4px solid #1e40af;padding:12px 16px;margin:20px 0;border-radius:0 8px 8px 0;"><p style="margin:0;color:#1e40af;font-size:14px;line-height:1.8;">📞 <strong>' + c.phone + '</strong><br/>📧 <strong>' + c.email + '</strong></p></div>';
  }
  function row(label, value, shade) {
    var bg = shade ? "background:#f8fafc;" : "";
    return '<tr style="' + bg + '"><td style="padding:9px 12px;color:#64748b;font-size:13px;width:42%;border-bottom:1px solid #f1f5f9;">' + label + '</td><td style="padding:9px 12px;color:#1e293b;font-size:13px;font-weight:600;border-bottom:1px solid #f1f5f9;">' + value + '</td></tr>';
  }

  var C = cfg();
  var parentName    = e.record.get("parentName")          || "";
  var parentEmail   = e.record.get("email")               || "";
  var childName     = e.record.get("childName")           || "";
  var childClass    = e.record.get("childClass")          || "";
  var schoolName    = e.record.get("schoolName")          || "";
  var homeAddress   = e.record.get("homeAddress")         || "";
  var contactNumber = e.record.get("contactNumber")       || "";
  var shift         = e.record.get("preferredShift")      || "";
  var notes         = e.record.get("specialInstructions") || "None";
  var submissionId  = e.record.id;

  // 1. Admin Alert
  try {
    var adminMail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: C.adminEmail }],
      subject: "New Enrollment — " + childName + " (" + parentName + ")",
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + hdr("New Enrollment Received", "Review and approve in the admin portal")
        + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
        + '<table style="width:100%;border-collapse:collapse;">'
        + row("Parent Name",   parentName,    false)
        + row("Email",         parentEmail,   true)
        + row("Contact",       contactNumber, false)
        + row("Child Name",    childName,     true)
        + row("Class",         childClass,    false)
        + row("School",        schoolName,    true)
        + row("Address",       homeAddress,   false)
        + row("Shift",         shift,         true)
        + row("Notes",         notes,         false)
        + row("Submission ID", submissionId,  true)
        + '</table>'
        + '<div style="margin-top:20px;text-align:center;"><a href="' + C.pbAdmin + '/enrollments" style="background:#1e40af;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Review in Admin Portal →</a></div>'
        + '</div>' + ftr() + '</div>',
    });
    $app.newMailClient().send(adminMail);
  } catch (err) {
    console.error("[enrollment-notification] Admin email failed:", err);
  }

  // 2. Parent Confirmation
  if (!parentEmail) { e.next(); return; }
  try {
    var parentMail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: parentEmail }],
      subject: "Enrollment Received — " + C.name,
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + hdr("Thank You for Enrolling!", "We have received your application")
        + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
        + '<p style="color:#1e293b;margin:0 0 12px;">Dear <strong>' + parentName + '</strong>,</p>'
        + '<p style="color:#475569;line-height:1.7;margin:0 0 20px;">Thank you for enrolling with ' + C.name + '. Our team will review your application within <strong>1-2 business days</strong>.</p>'
        + '<div style="background:#f1f5f9;border-radius:10px;padding:16px;margin-bottom:20px;">'
        + '<table style="width:100%;border-collapse:collapse;">'
        + row("Child Name",    childName,    false)
        + row("Class",         childClass,   true)
        + row("School",        schoolName,   false)
        + row("Shift",         shift,        true)
        + row("Submission ID", submissionId, false)
        + '</table></div>'
        + '<p style="color:#1e293b;font-weight:700;margin:0 0 10px;">What happens next?</p>'
        + '<ol style="color:#475569;line-height:2;padding-left:20px;font-size:13px;">'
        + '<li>Our team reviews your application within 1-2 business days</li>'
        + '<li>We call you on <strong>' + contactNumber + '</strong> to confirm</li>'
        + '<li>Your parent portal account is created and login details are emailed</li>'
        + '</ol>'
        + ctc() + '</div>' + ftr() + '</div>',
    });
    $app.newMailClient().send(parentMail);
  } catch (err) {
    console.error("[enrollment-notification] Parent email failed:", err);
  }

  e.next();
}, "enrollments");