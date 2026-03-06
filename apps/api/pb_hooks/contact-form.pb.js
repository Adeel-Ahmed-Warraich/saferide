/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {

  function cfg() {
    return { name: "SafeRide School Transport", phone: "+92 300 XXXXXXX", email: "support@saferide.com.pk", website: "https://saferide.com.pk", address: "Lake City, Lahore, Pakistan", adminEmail: "support@saferide.com.pk" };
  }
  function hdr(title, sub) {
    var s = sub ? '<p style="color:#bfdbfe;margin:6px 0 0;font-size:14px;">' + sub + '</p>' : "";
    return '<div style="background:#1e40af;padding:28px 24px;border-radius:10px 10px 0 0;"><h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">' + title + '</h2>' + s + '</div>';
  }
  function ftr() {
    var c = cfg();
    return '<div style="background:#f8fafc;padding:16px;text-align:center;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;"><p style="margin:0;color:#94a3b8;font-size:11px;">' + c.name + ' · ' + c.address + '</p></div>';
  }
  function ctc() {
    var c = cfg();
    return '<div style="background:#dbeafe;border-left:4px solid #1e40af;padding:12px 16px;margin:20px 0;border-radius:0 8px 8px 0;"><p style="margin:0;color:#1e40af;font-size:14px;line-height:1.8;">📞 <strong>' + c.phone + '</strong><br/>📧 <strong>' + c.email + '</strong></p></div>';
  }
  function row(label, value, shade) {
    var bg = shade ? "background:#f8fafc;" : "";
    return '<tr style="' + bg + '"><td style="padding:9px 12px;color:#64748b;font-size:13px;width:42%;border-bottom:1px solid #f1f5f9;">' + label + '</td><td style="padding:9px 12px;color:#1e293b;font-size:13px;font-weight:600;border-bottom:1px solid #f1f5f9;">' + value + '</td></tr>';
  }

  var C           = cfg();
  var senderName  = e.record.get("name")    || "Visitor";
  var senderEmail = e.record.get("email")   || "";
  var subject     = e.record.get("subject") || "General Inquiry";
  var message     = e.record.get("message") || "";
  var phone       = e.record.get("phone")   || "Not provided";

  // 1. Admin alert
  try {
    var adminMail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: C.adminEmail }],
      subject: "New Contact Message — " + subject,
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + hdr("New Contact Form Message", "Via saferide.com.pk/contact")
        + '<div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;">'
        + '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">'
        + row("From",    senderName,  false)
        + row("Email",   senderEmail, true)
        + row("Phone",   phone,       false)
        + row("Subject", subject,     true)
        + '</table>'
        + '<p style="margin:0 0 8px;font-weight:700;color:#1e293b;font-size:13px;">Message:</p>'
        + '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px;"><p style="margin:0;color:#1e293b;font-size:13px;line-height:1.7;">' + message + '</p></div>'
        + '<div style="margin-top:16px;text-align:center;"><a href="mailto:' + senderEmail + '?subject=Re: ' + subject + '" style="background:#1e40af;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px;display:inline-block;">Reply to ' + senderName + ' →</a></div>'
        + '</div>' + ftr() + '</div>',
    });
    $app.newMailClient().send(adminMail);
  } catch (err) {
    console.error("[contact-form] Admin email failed:", err);
  }

  // 2. Auto-reply
  if (!senderEmail) { e.next(); return; }
  try {
    var replyMail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: senderEmail }],
      subject: "Message Received — " + C.name,
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + hdr("Message Received!", "We will be in touch shortly")
        + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
        + '<p style="color:#1e293b;margin:0 0 12px;">Dear <strong>' + senderName + '</strong>,</p>'
        + '<p style="color:#475569;line-height:1.7;margin:0 0 16px;">Thank you for contacting ' + C.name + '. We will respond within <strong>24 hours</strong> on business days.</p>'
        + ctc() + '</div>' + ftr() + '</div>',
    });
    $app.newMailClient().send(replyMail);
  } catch (err) {
    console.error("[contact-form] Auto-reply failed:", err);
  }

  e.next();
}, "contact_messages");