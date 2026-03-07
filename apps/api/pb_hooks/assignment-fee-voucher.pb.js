/// <reference path="../pb_data/types.d.ts" />

/**
 * api/pb_hooks/assignment-fee-voucher.pb.js
 *
 * TRIGGER: onRecordAfterCreateSuccess on the `assignments` collection.
 *
 * WHAT IT DOES
 * ────────────
 * When admin assigns a van to a child (creates an assignment record),
 * this hook automatically:
 *   1. Creates an advance-fee payment voucher for the upcoming month.
 *   2. Sends the parent a branded fee-voucher email with payment details.
 *
 * DUE DATE LOGIC
 * ──────────────
 * • Joining before the 15th → fee due by the last day of the current month.
 * • Joining on/after the 15th → fee due by the last day of the next month
 *   (first month is complimentary — parent pays full next month in advance).
 *
 * VOUCHER NUMBER FORMAT: INV-YYYY-NNNN (padded sequential from payment count)
 *
 * IDEMPOTENCY
 * ───────────
 * Checks for an existing Pending/PendingAdminApproval payment for the same
 * parent + childLabel + month before creating — will not double-create.
 */

onRecordAfterCreateSuccess((e) => {

  function cfg() {
    return {
      name:      "SafeRide School Transport",
      phone:     "+92 300 XXXXXXX",
      whatsapp:  "923001234567",
      email:     "support@saferide.com.pk",
      website:   "https://saferide.com.pk",
      address:   "Lake City, Lahore, Pakistan",
      portalUrl: "https://saferide.com.pk/payments",
      bank: {
        name:    "Meezan Bank",
        title:   "SafeRide Transport",
        account: "0123456789",
        iban:    "PK34MEZN00000123456789",
      },
      merchants: {
        easypaisa: "SAFERIDE001",
        jazzcash:  "SAFERIDE_JAZZ_001",
      },
    };
  }

  function hdr(title, sub, bg) {
    bg = bg || "#1e40af";
    var s = sub ? '<p style="color:#bfdbfe;margin:6px 0 0;font-size:14px;">' + sub + "</p>" : "";
    return '<div style="background:' + bg + ';padding:28px 24px;border-radius:10px 10px 0 0;"><h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">' + title + "</h2>" + s + "</div>";
  }
  function ftr() {
    var c = cfg();
    return '<div style="background:#f8fafc;padding:16px;text-align:center;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;"><p style="margin:0 0 5px;color:#64748b;font-size:12px;">📞 ' + c.phone + " &nbsp;·&nbsp; 📧 " + c.email + '</p><p style="margin:0;color:#94a3b8;font-size:11px;">' + c.name + " · " + c.address + "</p></div>";
  }
  function row(label, value, shade) {
    var bg = shade ? "background:#f8fafc;" : "";
    return '<tr style="' + bg + '"><td style="padding:9px 12px;color:#64748b;font-size:13px;width:45%;border-bottom:1px solid #f1f5f9;">' + label + '</td><td style="padding:9px 12px;color:#1e293b;font-size:13px;font-weight:600;border-bottom:1px solid #f1f5f9;">' + value + "</td></tr>";
  }

  // ── Read assignment fields ──────────────────────────────────────────────
  var parentId    = e.record.get("parentId")    || "";
  var childLabel  = e.record.get("childLabel")  || "";
  var monthlyFee  = e.record.get("monthlyFee")  || 0;
  var joiningDate = e.record.get("joiningDate") || new Date().toISOString().slice(0, 10);
  var shift       = e.record.get("shift")       || "";

  if (!parentId || !monthlyFee) {
    console.log("[assignment-fee-voucher] Skipping — no parentId or monthlyFee set");
    e.next(); return;
  }

  // ── Fetch parent details ────────────────────────────────────────────────
  var parentEmail = "";
  var parentName  = "Parent";
  var primaryChild = "";

  try {
    var parent  = $app.findRecordById("parents", parentId);
    parentEmail  = parent.get("email")     || "";
    parentName   = parent.get("fullName")  || "Parent";
    primaryChild = parent.get("childName") || "";
  } catch (err) {
    console.error("[assignment-fee-voucher] Could not fetch parent:", err);
    e.next(); return;
  }

  var child = childLabel || primaryChild;

  // ── Calculate due date ─────────────────────────────────────────────────
  var jd   = new Date(joiningDate);
  var day  = jd.getDate();
  // If joining before 15th → current month end; on/after 15th → next month end
  var dueYear  = jd.getFullYear();
  var dueMon   = day < 15 ? jd.getMonth() : jd.getMonth() + 1;
  if (dueMon > 11) { dueMon = 0; dueYear++; }
  var dueDate = new Date(dueYear, dueMon + 1, 0); // last day of target month
  var dueDateStr = dueDate.toISOString().slice(0, 10);

  // Month label the payment covers
  var monthLabel = dueDate.toLocaleString("en-PK", { month: "long", year: "numeric" });

  // ── Idempotency check — don't create duplicate vouchers ───────────────
  try {
    var existing = $app.findFirstRecordByFilter(
      "payments",
      'parentId="' + parentId + '" && childLabel="' + child + '" && month="' + monthLabel + '" && (status="Pending" || status="PendingAdminApproval")'
    );
    if (existing) {
      console.log("[assignment-fee-voucher] Voucher already exists for " + child + " / " + monthLabel + " — skipping");
      e.next(); return;
    }
  } catch (_) {
    // findFirstRecordByFilter throws if no record found — that's fine, continue
  }

  // ── Generate voucher number INV-YYYY-NNNN ──────────────────────────────
  var voucherNum = "INV-0001";
  try {
    var countResult = $app.findRecordsByFilter("payments", "voucherNumber != ''", "-created", 1, 0);
    if (countResult && countResult.length > 0) {
      var lastVoucher = countResult[0].get("voucherNumber") || "INV-0000";
      var lastNum     = parseInt(lastVoucher.split("-").pop(), 10) || 0;
      var nextNum     = String(lastNum + 1).padStart(4, "0");
      voucherNum      = "INV-" + new Date().getFullYear() + "-" + nextNum;
    } else {
      voucherNum = "INV-" + new Date().getFullYear() + "-0001";
    }
  } catch (_) {
    voucherNum = "INV-" + new Date().getFullYear() + "-0001";
  }

  // ── Create payment/voucher record ──────────────────────────────────────
  try {
    var paymentsCol = $app.findCollectionByNameOrId("payments");
    var payment = new Record(paymentsCol);
    payment.set("parentId",      parentId);
    payment.set("childLabel",    child);
    payment.set("amount",        Number(monthlyFee));
    payment.set("dueDate",       dueDateStr);
    payment.set("month",         monthLabel);
    payment.set("paymentMethod", "BankDeposit"); // default; parent can change
    payment.set("status",        "Pending");
    payment.set("voucherNumber", voucherNum);
    payment.set("voucherType",   "Advance");
    $app.save(payment);
    console.log("[assignment-fee-voucher] Voucher " + voucherNum + " created for " + child);
  } catch (err) {
    console.error("[assignment-fee-voucher] Failed to create payment record:", err);
    e.next(); return;
  }

  // ── Send fee-voucher email to parent ───────────────────────────────────
  if (!parentEmail) { e.next(); return; }

  var C = cfg();
  try {
    var mail = new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to:   [{ address: parentEmail }],
      subject: "Fee Voucher — " + monthLabel + " · " + C.name,
      html: '<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">'
        + hdr("Fee Payment Voucher", "Your transport fee for " + monthLabel, "#1e40af")
        + '<div style="background:#fff;padding:24px;border:1px solid #e2e8f0;">'
        + '<p style="color:#1e293b;margin:0 0 12px;">Dear <strong>' + parentName + '</strong>,</p>'
        + '<p style="color:#475569;line-height:1.7;margin:0 0 20px;">Your child\'s transport has been arranged. Please pay the advance fee before the due date to activate service.</p>'

        // Voucher box
        + '<div style="border:2px solid #1e40af;border-radius:10px;overflow:hidden;margin-bottom:20px;">'
        + '<div style="background:#1e40af;padding:10px 18px;display:flex;justify-content:space-between;align-items:center;">'
        + '<p style="margin:0;color:#fff;font-weight:700;font-size:15px;">FEE VOUCHER — ' + voucherNum + '</p>'
        + '<span style="background:#fbbf24;color:#1e3a8a;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;">ADVANCE</span>'
        + '</div>'
        + '<div style="padding:16px;background:#f0f7ff;">'
        + '<table style="width:100%;border-collapse:collapse;">'
        + row("Voucher No.",    voucherNum,             false)
        + row("Child",         child,                  true)
        + row("Shift",         shift,                  false)
        + row("Month Covered", monthLabel,              true)
        + row("Amount Due",    "Rs. " + Number(monthlyFee).toLocaleString(), false)
        + '<tr><td style="padding:10px 12px;color:#64748b;font-size:13px;border-top:2px solid #bfdbfe;">Due Date</td>'
        + '<td style="padding:10px 12px;font-weight:800;color:#dc2626;font-size:16px;border-top:2px solid #bfdbfe;">'
        + new Date(dueDateStr).toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })
        + '</td></tr>'
        + '</table>'
        + '</div></div>'

        // Payment methods
        + '<p style="color:#1e293b;font-weight:700;margin:0 0 12px;">How to Pay:</p>'
        + '<div style="display:grid;gap:10px;margin-bottom:20px;">'

        // Easypaisa
        + '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;">'
        + '<p style="margin:0 0 4px;font-weight:700;color:#15803d;font-size:13px;">📱 Easypaisa / JazzCash</p>'
        + '<p style="margin:0;color:#374151;font-size:13px;">Merchant ID: <strong>' + C.merchants.easypaisa + '</strong></p>'
        + '<p style="margin:0;color:#374151;font-size:13px;">Amount: <strong>Rs. ' + Number(monthlyFee).toLocaleString() + '</strong> · Ref: <strong>' + voucherNum + '</strong></p>'
        + '</div>'

        // Bank
        + '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;">'
        + '<p style="margin:0 0 4px;font-weight:700;color:#1e40af;font-size:13px;">🏦 Bank Transfer — ' + C.bank.name + '</p>'
        + '<p style="margin:0;color:#374151;font-size:13px;">Account Title: <strong>' + C.bank.title + '</strong></p>'
        + '<p style="margin:0;color:#374151;font-size:13px;">Account No: <strong>' + C.bank.account + '</strong></p>'
        + '<p style="margin:0;color:#374151;font-size:13px;">IBAN: <strong>' + C.bank.iban + '</strong></p>'
        + '</div>'
        + '</div>'

        + '<div style="background:#fef9c3;border-left:4px solid #ca8a04;padding:10px 14px;border-radius:0 6px 6px 0;margin-bottom:20px;">'
        + '<p style="margin:0;color:#854d0e;font-size:13px;">After paying, upload your receipt screenshot in the parent dashboard under <strong>Make Payment</strong> and enter the Transaction ID. Service activates once the admin verifies your payment.</p>'
        + '</div>'

        + '<div style="text-align:center;margin-bottom:20px;">'
        + '<a href="' + C.portalUrl + '" style="background:#1e40af;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;font-size:14px;">Pay Now via Dashboard →</a>'
        + '</div>'

        + '<div style="background:#dbeafe;border-left:4px solid #1e40af;padding:12px 16px;border-radius:0 8px 8px 0;">'
        + '<p style="margin:0;color:#1e40af;font-size:14px;line-height:1.8;">📞 <strong>' + C.phone + '</strong><br/>📧 <strong>' + C.email + '</strong></p>'
        + '</div>'
        + '</div>' + ftr() + '</div>',
    });
    $app.newMailClient().send(mail);
    console.log("[assignment-fee-voucher] Voucher email sent to " + parentEmail);
  } catch (err) {
    console.error("[assignment-fee-voucher] Email failed:", err);
  }

  e.next();
}, "assignments");