/// <reference path="../pb_data/types.d.ts" />

onRecordAfterUpdateSuccess((e) => {

  function cfg() {
    return { name: "SafeRide School Transport", phone: "+92 300 XXXXXXX", email: "support@saferide.com.pk", website: "https://saferide.com.pk", address: "Lake City, Lahore, Pakistan" };
  }
  function hdr(title, sub, bg) {
    bg = bg || "#1e40af";
    return '<div style="background:' + bg + ';padding:28px 24px;border-radius:10px 10px 0 0;"><h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">' + title + '</h2>' + (sub ? '<p style="color:#bfdbfe;margin:6px 0 0;font-size:14px;">' + sub + '</p>' : '') + '</div>';
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

  var status = e.record.get("status") || "";
  if (status !== "Paid" && status !== "Rejected") { e.next(); return; }

  var C       = cfg();
  var amount  = e.record.get("amount")        || "0";
  var month   = e.record.get("month")         || "";
  var method  = e.record.get("paymentMethod") || "N/A";
  var payId   = e.record.id;
  var receiptNo = payId.slice(-8).toUpperCase();
  var payDate = new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" });

  var parentEmail = "";
  var parentName  = "Parent";
  var childName   = "";

  try {
    var parent = $app.findRecordById("parents", e.record.get("parentId"));
    parentEmail = parent.get("email")     || "";
    parentName  = parent.get("fullName")  || parent.get("name") || "Parent";
    childName   = parent.get("childName") || "";
  } catch (err) {
    console.error("[payment-status] Could not fetch parent:", err);
    e.next(); return;
  }

  if (!parentEmail) { e.next(); return; }

  if (status === "Paid") {
    try {
      var paidMail = new MailerMessage({
        from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
        to:   [{ address: parentEmail }],
        subject: "Payment Confirmed — SafeRide Fee Receipt for " + month,
        html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
          + hdr("Payment Confirmed", "Fee receipt for " + month, "#15803d")
          + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
          + '<p style="color:#1e293b;margin:0 0 12px;">Dear <strong>' + parentName + '</strong>,</p>'
          + '<p style="color:#475569;margin:0 0 20px;">Your payment has been verified. Please keep this as your official receipt.</p>'
          + '<div style="border:2px solid #15803d;border-radius:10px;overflow:hidden;margin-bottom:20px;">'
          + '<div style="background:#15803d;padding:10px 18px;"><p style="margin:0;color:#fff;font-weight:700;">OFFICIAL RECEIPT — #' + receiptNo + '</p></div>'
          + '<div style="padding:16px;background:#f0fdf4;"><table style="width:100%;border-collapse:collapse;">'
          + row("Receipt No.", receiptNo,  false)
          + row("Date",        payDate,    true)
          + row("Parent",      parentName, false)
          + row("Child",       childName,  true)
          + row("Month",       month,      false)
          + row("Method",      method,     true)
          + '<tr><td style="padding:10px 12px;color:#64748b;font-size:13px;border-top:2px solid #bbf7d0;">Amount Paid</td><td style="padding:10px 12px;font-weight:800;color:#15803d;font-size:20px;border-top:2px solid #bbf7d0;">Rs. ' + amount + '</td></tr>'
          + '</table></div>'
          + '<div style="background:#15803d;padding:8px;text-align:center;"><p style="margin:0;color:#dcfce7;font-size:12px;">VERIFIED AND CONFIRMED BY SAFERIDE SCHOOL TRANSPORT</p></div>'
          + '</div>'
          + '<p style="text-align:center;font-size:13px;color:#475569;">Download receipt: <a href="' + C.website + '/payment-history" style="color:#1e40af;">Payment History</a></p>'
          + ctc() + '</div>' + ftr() + '</div>',
      });
      $app.newMailClient().send(paidMail);
    } catch (err) {
      console.error("[payment-status] Paid email failed:", err);
    }
  }

  if (status === "Rejected") {
    try {
      var rejMail = new MailerMessage({
        from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
        to:   [{ address: parentEmail }],
        subject: "Payment Could Not Be Verified — SafeRide (" + month + ")",
        html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
          + hdr("Payment Verification Issue", "Regarding your " + month + " payment", "#d97706")
          + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
          + '<p style="color:#1e293b;margin:0 0 12px;">Dear <strong>' + parentName + '</strong>,</p>'
          + '<p style="color:#475569;line-height:1.7;margin:0 0 16px;">We could not verify your payment of <strong>Rs. ' + amount + '</strong> for <strong>' + month + '</strong> via <strong>' + method + '</strong>.</p>'
          + '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:20px;">'
          + '<ul style="margin:0;padding-left:18px;color:#78350f;font-size:13px;line-height:2;">'
          + '<li>Receipt image is unclear or unreadable</li>'
          + '<li>Transaction ID does not match our records</li>'
          + '<li>Amount does not match the fee amount</li>'
          + '</ul></div>'
          + '<ol style="color:#475569;font-size:13px;line-height:2;padding-left:20px;">'
          + '<li>Log in and resubmit with a clear screenshot</li>'
          + '<li>Or contact us with your transaction ID</li>'
          + '</ol>'
          + ctc() + '</div>' + ftr() + '</div>',
      });
      $app.newMailClient().send(rejMail);
    } catch (err) {
      console.error("[payment-status] Rejected email failed:", err);
    }
  }

  e.next();
}, "payments");