/// <reference path="../pb_data/types.d.ts" />

onRecordAfterUpdateSuccess((e) => {

  function cfg() {
    return { name: "SafeRide School Transport", phone: "+92 300 XXXXXXX", email: "support@saferide.com.pk", website: "https://saferide.com.pk", address: "Lake City, Lahore, Pakistan" };
  }
  function hdr(title, sub, bg) {
    bg = bg || "#1e40af";
    var s = sub ? '<p style="color:#fecaca;margin:6px 0 0;font-size:14px;">' + sub + '</p>' : "";
    return '<div style="background:' + bg + ';padding:28px 24px;border-radius:10px 10px 0 0;"><h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">' + title + '</h2>' + s + '</div>';
  }
  function ftr() {
    var c = cfg();
    return '<div style="background:#f8fafc;padding:16px;text-align:center;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;"><p style="margin:0;color:#94a3b8;font-size:11px;">' + c.name + ' · ' + c.address + '</p></div>';
  }
  function ctc() {
    var c = cfg();
    return '<div style="background:#dbeafe;border-left:4px solid #1e40af;padding:12px 16px;margin:20px 0;border-radius:0 8px 8px 0;"><p style="margin:0;color:#1e40af;font-size:14px;line-height:1.8;">📞 <strong>' + c.phone + '</strong><br/>📧 <strong>' + c.email + '</strong></p></div>';
  }

  var status = e.record.get("status") || "";
  if (status !== "rejected") { e.next(); return; }

  var C            = cfg();
  var parentEmail  = e.record.get("email")       || "";
  var parentName   = e.record.get("parentName")  || "Parent";
  var childName    = e.record.get("childName")   || "";

  if (!parentEmail) { e.next(); return; }

  try {
    var mail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: parentEmail }],
      subject: "SafeRide Enrollment Update — " + childName,
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + hdr("Enrollment Update", "Regarding your application for " + childName, "#dc2626")
        + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
        + '<p style="color:#1e293b;margin:0 0 12px;">Dear <strong>' + parentName + '</strong>,</p>'
        + '<p style="color:#475569;line-height:1.7;margin:0 0 16px;">Thank you for your interest in ' + C.name + '. Unfortunately we are unable to accommodate your enrollment at this time.</p>'
        + '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px;margin-bottom:20px;">'
        + '<ul style="margin:0;padding-left:18px;color:#7f1d1d;font-size:13px;line-height:2;">'
        + '<li>Van capacity full for your selected shift or route</li>'
        + '<li>Your area not yet covered by current routes</li>'
        + '<li>Incomplete information on the form</li>'
        + '</ul></div>'
        + '<p style="color:#475569;">Please contact us — we may be able to add you to our waiting list.</p>'
        + ctc() + '</div>' + ftr() + '</div>',
    });
    $app.newMailClient().send(mail);
  } catch (err) {
    console.error("[enrollment-rejected] Email failed:", err);
  }

  e.next();
}, "enrollments");