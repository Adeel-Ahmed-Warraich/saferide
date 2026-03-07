/// <reference path="../pb_data/types.d.ts" />
/**
 * assignment-update-notify.pb.js  (#7)
 *
 * CREATE  → "Van Assigned" email to parent
 * UPDATE  → "Van / Fee Updated" email if record changes
 *
 * Separate from assignment-fee-voucher.pb.js which handles payment creation.
 */

function assignMailHelpers() {
  function cfg() {
    return {
      name:      "SafeRide School Transport",
      phone:     "+92 300 XXXXXXX",
      email:     "support@saferide.com.pk",
      portalUrl: "https://saferide.com.pk/login",
      address:   "Lake City, Lahore, Pakistan",
    };
  }
  function hdr(title, sub, bg) {
    bg = bg || "#1e40af";
    var s = sub ? '<p style="color:#bfdbfe;margin:6px 0 0;font-size:14px;">' + sub + "</p>" : "";
    return '<div style="background:' + bg + ';padding:28px 24px;border-radius:10px 10px 0 0;"><h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">' + title + "</h2>" + s + "</div>";
  }
  function ftr() {
    var c = cfg();
    return '<div style="background:#f8fafc;padding:16px;text-align:center;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;"><p style="margin:0;color:#94a3b8;font-size:11px;">' + c.name + " · " + c.address + "</p></div>";
  }
  function row(label, value, shade) {
    var bg = shade ? "background:#f8fafc;" : "";
    return '<tr style="' + bg + '"><td style="padding:9px 12px;color:#64748b;font-size:13px;width:40%;border-bottom:1px solid #f1f5f9;">' + label + '</td><td style="padding:9px 12px;color:#1e293b;font-size:13px;font-weight:600;border-bottom:1px solid #f1f5f9;">' + value + "</td></tr>";
  }
  function ctc() {
    var c = cfg();
    return '<div style="background:#dbeafe;border-left:4px solid #1e40af;padding:12px 16px;margin:20px 0;border-radius:0 8px 8px 0;"><p style="margin:0;color:#1e40af;font-size:14px;line-height:1.8;">📞 <strong>' + c.phone + "</strong><br/>📧 <strong>" + c.email + "</strong></p></div>";
  }
  return { cfg, hdr, ftr, row, ctc };
}

function getParentAndVan(parentId, vanId) {
  var result = { email: "", name: "Parent", child: "", vanDisplay: vanId, driver: "", driverPhone: "" };
  try {
    var parent = $app.findRecordById("parents", parentId);
    result.email = parent.get("email")    || "";
    result.name  = parent.get("fullName") || "Parent";
    result.child = parent.get("childName") || "";
  } catch (_) {}
  try {
    var van = $app.findRecordById("vans", vanId);
    result.vanDisplay  = van.get("vanId")       || vanId;
    result.driver      = van.get("driverName")  || "";
    result.driverPhone = van.get("driverPhone") || "";
  } catch (_) {}
  return result;
}

// ── CREATE ────────────────────────────────────────────────────────────────────
onRecordAfterCreateSuccess((e) => {
  var parentId   = e.record.get("parentId")  || "";
  var vanId      = e.record.get("vanId")     || "";
  var childLabel = e.record.get("childLabel")|| "";
  var shift      = e.record.get("shift")     || "";
  var fee        = e.record.get("monthlyFee")|| 0;

  if (!parentId || !vanId) { e.next(); return; }

  var p = getParentAndVan(parentId, vanId);
  if (!p.email) { e.next(); return; }

  var h = assignMailHelpers();
  var C = h.cfg();
  var child = childLabel || p.child;

  try {
    var mail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: p.email }],
      subject: "🚐 Van Assigned for " + child + " — SafeRide",
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + h.hdr("Van Assigned for " + child, "Transport is arranged — please pay the advance fee")
        + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
        + '<p style="color:#1e293b;margin:0 0 16px;">Dear <strong>' + p.name + '</strong>, a van has been assigned for <strong>' + child + '</strong>.</p>'
        + '<div style="background:#f0f7ff;border-radius:10px;padding:16px;margin-bottom:20px;">'
        + '<table style="width:100%;border-collapse:collapse;">'
        + h.row("Child",        child,       false)
        + h.row("Van",          p.vanDisplay,true)
        + h.row("Driver",       p.driver,    false)
        + (p.driverPhone ? h.row("Driver Phone", p.driverPhone, true) : "")
        + h.row("Shift",        shift,       false)
        + h.row("Monthly Fee",  "Rs. " + Number(fee).toLocaleString(), true)
        + '</table></div>'
        + '<p style="color:#475569;font-size:13px;margin:0 0 16px;">A fee voucher has been generated in your dashboard. Please pay the advance fee to activate the service.</p>'
        + '<div style="text-align:center;margin-bottom:20px;"><a href="' + C.portalUrl + '" style="background:#1e40af;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">View Dashboard & Pay →</a></div>'
        + h.ctc() + '</div>' + h.ftr() + '</div>',
    });
    $app.newMailClient().send(mail);
    console.log("[assignment-update-notify] Create email sent →", p.email);
  } catch (err) {
    console.error("[assignment-update-notify] Create email failed:", err);
  }
  e.next();
}, "assignments");

// ── UPDATE ────────────────────────────────────────────────────────────────────
onRecordAfterUpdateSuccess((e) => {
  var parentId   = e.record.get("parentId")  || "";
  var vanId      = e.record.get("vanId")     || "";
  var childLabel = e.record.get("childLabel")|| "";
  var shift      = e.record.get("shift")     || "";
  var fee        = e.record.get("monthlyFee")|| 0;

  if (!parentId || !vanId) { e.next(); return; }

  var p = getParentAndVan(parentId, vanId);
  if (!p.email) { e.next(); return; }

  var h = assignMailHelpers();
  var C = h.cfg();
  var child = childLabel || p.child;

  try {
    var mail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: p.email }],
      subject: "🔄 Transport Details Updated for " + child + " — SafeRide",
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + h.hdr("Transport Details Updated", "Your child's assignment has changed", "#d97706")
        + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
        + '<p style="color:#1e293b;margin:0 0 16px;">Dear <strong>' + p.name + '</strong>, the transport details for <strong>' + child + '</strong> have been updated.</p>'
        + '<div style="background:#fffbeb;border-radius:10px;padding:16px;margin-bottom:20px;">'
        + '<table style="width:100%;border-collapse:collapse;">'
        + h.row("Child",       child,       false)
        + h.row("Van",         p.vanDisplay,true)
        + h.row("Driver",      p.driver,    false)
        + h.row("Shift",       shift,       true)
        + h.row("Monthly Fee", "Rs. " + Number(fee).toLocaleString(), false)
        + '</table></div>'
        + '<div style="background:#fef9c3;border-left:4px solid #ca8a04;padding:10px 14px;border-radius:0 6px 6px 0;margin-bottom:20px;"><p style="margin:0;color:#854d0e;font-size:13px;">If your fee changed, a new payment voucher has been generated in your dashboard.</p></div>'
        + '<div style="text-align:center;margin-bottom:20px;"><a href="' + C.portalUrl + '" style="background:#d97706;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">View Updated Dashboard →</a></div>'
        + h.ctc() + '</div>' + h.ftr() + '</div>',
    });
    $app.newMailClient().send(mail);
    console.log("[assignment-update-notify] Update email sent →", p.email);
  } catch (err) {
    console.error("[assignment-update-notify] Update email failed:", err);
  }
  e.next();
}, "assignments");
