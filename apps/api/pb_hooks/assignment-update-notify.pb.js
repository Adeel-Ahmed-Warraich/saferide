/// <reference path="../pb_data/types.d.ts" />
/**
 * assignment-update-notify.pb.js
 *
 * Emails parent when admin assigns or updates their van.
 * Uses PocketBase 0.36 hook syntax.
 */

// Shared helper — scoped in each handler to avoid global variable collisions
function buildAssignEmail(parentId, vanId, childLabel, shift, monthlyFee, isUpdate) {
  var parentEmail = "", parentName = "Parent", primaryChild = "";
  var vanDisplay = vanId, driverName = "", driverPhone = "";

  try {
    var parent = $app.findRecordById("parents", parentId);
    parentEmail  = parent.getString("email");
    parentName   = parent.getString("fullName") || "Parent";
    primaryChild = parent.getString("childName") || "";
  } catch (e) {
    console.error("[assign-notify] parent fetch failed:", e.message);
    return null;
  }

  if (!parentEmail) return null;

  try {
    var van = $app.findRecordById("vans", vanId);
    vanDisplay  = van.getString("vanId")       || vanId;
    driverName  = van.getString("driverName")  || "";
    driverPhone = van.getString("driverPhone") || "";
  } catch (_) {}

  var child = childLabel || primaryChild;
  var feeStr = "Rs. " + Number(monthlyFee || 0).toLocaleString();

  var bg      = isUpdate ? "#d97706" : "#1e40af";
  var btnBg   = isUpdate ? "#d97706" : "#1e40af";
  var heading = isUpdate
    ? "Transport Details Updated for " + child
    : "Van Assigned for " + child;
  var subtext = isUpdate
    ? "Your child's route or fee has been changed"
    : "Transport is arranged — please pay the advance fee";
  var note = isUpdate
    ? '<div style="background:#fef9c3;border-left:4px solid #ca8a04;padding:10px 14px;border-radius:0 6px 6px 0;margin-bottom:20px;"><p style="margin:0;color:#854d0e;font-size:13px;">If your fee changed, a new payment voucher has been generated in your dashboard.</p></div>'
    : '<p style="color:#475569;font-size:13px;margin:0 0 16px;">A fee voucher has been generated in your dashboard. Please pay to activate the service.</p>';

  var rows = [
    ["Child",        child,       false],
    ["Van",          vanDisplay,  true],
    ["Driver",       driverName,  false],
    ["Shift",        shift,       true],
    ["Monthly Fee",  feeStr,      false],
  ];
  if (driverPhone) rows.splice(3, 0, ["Driver Phone", driverPhone, true]);

  var tableRows = rows.map(function(r) {
    var bg2 = r[2] ? "background:#f8fafc;" : "";
    return '<tr style="' + bg2 + '"><td style="padding:9px 12px;color:#64748b;font-size:13px;width:40%;border-bottom:1px solid #f1f5f9;">' + r[0] + '</td><td style="padding:9px 12px;color:#1e293b;font-size:13px;font-weight:600;border-bottom:1px solid #f1f5f9;">' + r[1] + "</td></tr>";
  }).join("");

  var html = '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
    + '<div style="background:' + bg + ';padding:28px 24px;border-radius:10px 10px 0 0;">'
    + '<h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">' + heading + '</h2>'
    + '<p style="color:#bfdbfe;margin:6px 0 0;font-size:14px;">' + subtext + '</p>'
    + '</div>'
    + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
    + '<p style="color:#1e293b;margin:0 0 16px;">Dear <strong>' + parentName + '</strong>,</p>'
    + note
    + '<div style="background:#f0f7ff;border-radius:10px;padding:16px;margin-bottom:20px;">'
    + '<table style="width:100%;border-collapse:collapse;">' + tableRows + '</table>'
    + '</div>'
    + '<div style="text-align:center;margin-bottom:20px;">'
    + '<a href="https://saferide.com.pk/login" style="background:' + btnBg + ';color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">View Dashboard →</a>'
    + '</div>'
    + '<div style="background:#dbeafe;border-left:4px solid #1e40af;padding:12px 16px;border-radius:0 8px 8px 0;">'
    + '<p style="margin:0;color:#1e40af;font-size:14px;line-height:1.8;">📞 <strong>+92 300 XXXXXXX</strong><br/>📧 <strong>support@saferide.com.pk</strong></p>'
    + '</div>'
    + '</div>'
    + '<div style="background:#f8fafc;padding:12px;text-align:center;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;">'
    + '<p style="margin:0;color:#94a3b8;font-size:11px;">SafeRide School Transport · Lake City, Lahore</p>'
    + '</div>'
    + '</div>';

  return { to: parentEmail, subject: (isUpdate ? "🔄 Transport Updated — " : "🚐 Van Assigned — ") + child + " · SafeRide", html: html };
}

function sendAssignEmail(parentId, vanId, childLabel, shift, monthlyFee, isUpdate) {
  var data = buildAssignEmail(parentId, vanId, childLabel, shift, monthlyFee, isUpdate);
  if (!data) return;
  try {
    var mail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: data.to }],
      subject: data.subject,
      html:    data.html,
    });
    $app.newMailClient().send(mail);
    console.log("[assign-notify] email sent →", data.to, isUpdate ? "(update)" : "(create)");
  } catch (e) {
    console.error("[assign-notify] email send failed:", e.message);
  }
}

// ── On CREATE ────────────────────────────────────────────────────────────────
onRecordAfterCreateSuccess(function(e) {
  var parentId   = e.record.getString("parentId");
  var vanId      = e.record.getString("vanId");
  var childLabel = e.record.getString("childLabel");
  var shift      = e.record.getString("shift");
  var fee        = e.record.get("monthlyFee");
  if (parentId && vanId) {
    sendAssignEmail(parentId, vanId, childLabel, shift, fee, false);
  }
  e.next();
}, "assignments");

// ── On UPDATE ────────────────────────────────────────────────────────────────
onRecordAfterUpdateSuccess(function(e) {
  var parentId   = e.record.getString("parentId");
  var vanId      = e.record.getString("vanId");
  var childLabel = e.record.getString("childLabel");
  var shift      = e.record.getString("shift");
  var fee        = e.record.get("monthlyFee");
  if (parentId && vanId) {
    sendAssignEmail(parentId, vanId, childLabel, shift, fee, true);
  }
  e.next();
}, "assignments");
