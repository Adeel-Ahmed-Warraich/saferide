/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {

  function cfg() {
    return {
      name:      "SafeRide School Transport",
      phone:     "+92 0301 4202944",
      email:     "support@saferide.com.pk",
      website:   "https://saferide.com.pk",
      address:   "Lake City, Lahore, Pakistan",
      portalUrl: "https://saferide.com.pk/login",
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
  var parentEmail = e.record.get("email")          || "";
  var parentName  = e.record.get("fullName") || e.record.get("name") || "Parent";
  var childName   = e.record.get("childName")      || "";
  var childClass  = e.record.get("childClass")     || "";
  var schoolName  = e.record.get("schoolName")     || "";
  var shift       = e.record.get("preferredShift") || "";
  var tempPass    = e.record.get("tempPassword")   || "";

  if (!parentEmail || !childName) { e.next(); return; }

  try {
    var mail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: parentEmail }],
      subject: "Welcome to SafeRide — Your Parent Portal is Ready!",
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + hdr("Welcome to SafeRide!", "Your enrollment is approved — portal access granted")
        + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
        + '<p style="color:#1e293b;margin:0 0 12px;">Dear <strong>' + parentName + '</strong>,</p>'
        + '<p style="color:#475569;line-height:1.7;margin:0 0 20px;">Your enrollment has been <strong style="color:#16a34a;">approved</strong>. Your parent portal is now active.</p>'
        + '<div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:10px;padding:18px;margin-bottom:20px;">'
        + '<p style="margin:0 0 12px;font-weight:700;color:#15803d;">Your Login Credentials:</p>'
        + '<table style="width:100%;border-collapse:collapse;">'
        + row("Portal URL", '<a href="' + C.portalUrl + '" style="color:#1e40af;">' + C.portalUrl + '</a>', false)
        + row("Email",      parentEmail, true)
        + row("Password",   tempPass || "Contact support", false)
        + '</table></div>'
        + '<div style="background:#fef9c3;border-left:4px solid #ca8a04;padding:10px 14px;border-radius:0 6px 6px 0;margin-bottom:20px;">'
        + '<p style="margin:0;color:#854d0e;font-size:13px;">Please change your password after first login.</p></div>'
        + '<p style="color:#1e293b;font-weight:700;margin:0 0 10px;">Child Transport Details:</p>'
        + '<div style="background:#f1f5f9;border-radius:10px;padding:4px;margin-bottom:20px;">'
        + '<table style="width:100%;border-collapse:collapse;">'
        + row("Child Name", childName,  false)
        + row("Class",      childClass, true)
        + row("School",     schoolName, false)
        + row("Shift",      shift,      true)
        + '</table></div>'
        + ctc() + '</div>' + ftr() + '</div>',
    });
    $app.newMailClient().send(mail);
  } catch (err) {
    console.error("[parent-welcome] Email failed:", err);
  }

  e.next();
}, "parents");