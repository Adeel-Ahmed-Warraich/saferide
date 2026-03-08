import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import pb from "@/lib/pocketbaseClient.js";
import { useToast } from "@/hooks/use-toast.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.jsx";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Wrench,
  Fuel,
  Plus,
  Search,
  Download,
  X,
  ChevronDown,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Filter,
} from "lucide-react";

// ─── Utility ─────────────────────────────────────────────────────────────────
const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
const today = () => new Date().toISOString().split("T")[0];

// ─── Modal Shell ──────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, sub, trend }) => (
  <div className={`bg-white rounded-2xl p-5 border-2 ${color} shadow-sm`}>
    <div className="flex justify-between items-start mb-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.replace("border-", "bg-").replace("-200", "-100")}`}
      >
        <Icon
          className={`w-5 h-5 ${color.replace("border-", "text-").replace("-200", "-600")}`}
        />
      </div>
      {trend !== undefined && (
        <span
          className={`text-xs font-bold flex items-center gap-0.5 ${trend >= 0 ? "text-green-600" : "text-red-500"}`}
        >
          {trend >= 0 ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-black text-gray-900 mb-0.5">{value}</div>
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </div>
    {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AccountingPage = () => {
  const { toast } = useToast();

  // ── State ──────────────────────────────────────────────────────────────────
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [parents, setParents] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const [filterMonth, setFilterMonth] = useState("");
  const [searchIncome, setSearchIncome] = useState("");
  const [searchExpense, setSearchExpense] = useState("");

  const [incomeForm, setIncomeForm] = useState({
    parentId: "",
    childLabel: "",
    type: "Monthly Fee",
    amount: "",
    month: "",
    paymentMethod: "Cash",
    receivedDate: today(),
    notes: "",
    status: "Received",
  });

  const [expenseForm, setExpenseForm] = useState({
    vanId: "",
    category: "Fuel",
    amount: "",
    description: "",
    expenseDate: today(),
    vendor: "",
    receiptNo: "",
    notes: "",
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const safeFetch = async (fn, label) => {
    try {
      return await fn();
    } catch (e) {
      console.warn(
        `Accounting: failed to fetch ${label}`,
        e?.status,
        e?.message,
      );
      return { items: [] };
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    const [incomeRes, expenseRes, parentsRes, vansRes, approvedEnrollRes] = await Promise.all([
      safeFetch(
        () =>
          pb
            .collection("income_records")
            .getList(1, 1000, {
              sort: "-receivedDate",
              expand: "parentId",
              $autoCancel: false,
            }),
        "income",
      ),
      safeFetch(
        () =>
          pb
            .collection("vehicle_expenses")
            .getList(1, 1000, {
              sort: "-expenseDate",
              expand: "vanId",
              $autoCancel: false,
            }),
        "expenses",
      ),
      safeFetch(
        () => pb.collection("parents").getList(1, 500, { $autoCancel: false }),
        "parents",
      ),
      safeFetch(
        () => pb.collection("vans").getList(1, 100, { $autoCancel: false }),
        "vans",
      ),
      safeFetch(
        () => pb.collection("enrollments").getList(1, 500, {
          filter: 'status = "approved"',
          $autoCancel: false,
        }),
        "approvedEnrollments",
      ),
    ]);
    setIncome(incomeRes.items);
    setExpenses(expenseRes.items);
    setParents(parentsRes.items);
    setVans(vansRes.items);
    setApprovedEnrollments(approvedEnrollRes.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── Computed Stats ─────────────────────────────────────────────────────────
  const totalIncome = income
    .filter((i) => i.status === "Received")
    .reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingIncome = income
    .filter((i) => i.status === "Pending")
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  const expenseByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
    return acc;
  }, {});

  const incomeByType = income
    .filter((i) => i.status === "Received")
    .reduce((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + Number(i.amount || 0);
      return acc;
    }, {});

  // ── Filters ────────────────────────────────────────────────────────────────
  const filteredIncome = income.filter((i) => {
    const matchSearch =
      !searchIncome ||
      i.expand?.parentId?.fullName
        ?.toLowerCase()
        .includes(searchIncome.toLowerCase()) ||
      i.type?.toLowerCase().includes(searchIncome.toLowerCase());
    const matchMonth =
      !filterMonth ||
      i.month === filterMonth ||
      i.receivedDate?.startsWith(filterMonth);
    return matchSearch && matchMonth;
  });

  const filteredExpenses = expenses.filter((e) => {
    const matchSearch =
      !searchExpense ||
      e.category?.toLowerCase().includes(searchExpense.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchExpense.toLowerCase()) ||
      e.expand?.vanId?.vanId
        ?.toLowerCase()
        .includes(searchExpense.toLowerCase());
    const matchMonth = !filterMonth || e.expenseDate?.startsWith(filterMonth);
    return matchSearch && matchMonth;
  });

  // ── Income CRUD ────────────────────────────────────────────────────────────
  const saveIncome = async () => {
    try {
      if (editingIncome) {
        await pb
          .collection("income_records")
          .update(editingIncome.id, incomeForm, { $autoCancel: false });
        toast({ title: "✓ Income record updated" });
      } else {
        await pb
          .collection("income_records")
          .create(incomeForm, { $autoCancel: false });
        toast({ title: "✓ Income record added" });
      }
      setShowIncomeModal(false);
      setEditingIncome(null);
      resetIncomeForm();
      fetchAll();
    } catch (e) {
      toast({
        title: "Error saving income",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const deleteIncome = async (id) => {
    if (!confirm("Delete this income record?")) return;
    try {
      await pb.collection("income_records").delete(id, { $autoCancel: false });
      toast({ title: "Record deleted" });
      fetchAll();
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  // ── Expense CRUD ───────────────────────────────────────────────────────────
  const saveExpense = async () => {
    try {
      if (editingExpense) {
        await pb
          .collection("vehicle_expenses")
          .update(editingExpense.id, expenseForm, { $autoCancel: false });
        toast({ title: "✓ Expense updated" });
      } else {
        await pb
          .collection("vehicle_expenses")
          .create(expenseForm, { $autoCancel: false });
        toast({ title: "✓ Expense recorded" });
      }
      setShowExpenseModal(false);
      setEditingExpense(null);
      resetExpenseForm();
      fetchAll();
    } catch (e) {
      toast({
        title: "Error saving expense",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const deleteExpense = async (id) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      await pb
        .collection("vehicle_expenses")
        .delete(id, { $autoCancel: false });
      toast({ title: "Record deleted" });
      fetchAll();
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  // ── Form Helpers ───────────────────────────────────────────────────────────
  const resetIncomeForm = () =>
    setIncomeForm({
      parentId: "",
      childLabel: "",
      type: "Monthly Fee",
      amount: "",
      month: "",
      paymentMethod: "Cash",
      receivedDate: today(),
      notes: "",
      status: "Received",
    });

  const resetExpenseForm = () =>
    setExpenseForm({
      vanId: "",
      category: "Fuel",
      amount: "",
      description: "",
      expenseDate: today(),
      vendor: "",
      receiptNo: "",
      notes: "",
    });

  const openEditIncome = (record) => {
    setEditingIncome(record);
    setIncomeForm({
      parentId: record.parentId || "",
      childLabel: record.childLabel || "",
      type: record.type || "Monthly Fee",
      amount: record.amount || "",
      month: record.month || "",
      paymentMethod: record.paymentMethod || "Cash",
      receivedDate: record.receivedDate?.split("T")[0] || today(),
      notes: record.notes || "",
      status: record.status || "Received",
    });
    setShowIncomeModal(true);
  };

  const openEditExpense = (record) => {
    setEditingExpense(record);
    setExpenseForm({
      vanId: record.vanId || "",
      category: record.category || "Fuel",
      amount: record.amount || "",
      description: record.description || "",
      expenseDate: record.expenseDate?.split("T")[0] || today(),
      vendor: record.vendor || "",
      receiptNo: record.receiptNo || "",
      notes: record.notes || "",
    });
    setShowExpenseModal(true);
  };

  // ── CSV Export ─────────────────────────────────────────────────────────────
  const exportCSV = (rows, filename, cols) => {
    const header = cols.map((c) => c.label).join(",");
    const body = rows
      .map((r) =>
        cols.map((c) => `"${c.get ? c.get(r) : (r[c.key] ?? "")}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const exportIncome = () =>
    exportCSV(filteredIncome, "saferide_income.csv", [
      {
        label: "Parent",
        get: (r) => r.expand?.parentId?.fullName || r.parentId,
      },
      { label: "Type", key: "type" },
      { label: "Amount", key: "amount" },
      { label: "Month", key: "month" },
      { label: "Payment Method", key: "paymentMethod" },
      { label: "Date", get: (r) => r.receivedDate?.split("T")[0] },
      { label: "Status", key: "status" },
      { label: "Notes", key: "notes" },
    ]);

  const exportExpenses = () =>
    exportCSV(filteredExpenses, "saferide_expenses.csv", [
      { label: "Van", get: (r) => r.expand?.vanId?.vanId || r.vanId },
      { label: "Category", key: "category" },
      { label: "Amount", key: "amount" },
      { label: "Description", key: "description" },
      { label: "Date", get: (r) => r.expenseDate?.split("T")[0] },
      { label: "Vendor", key: "vendor" },
      { label: "Receipt No", key: "receiptNo" },
      { label: "Notes", key: "notes" },
    ]);

  // ── Status badge helper ────────────────────────────────────────────────────
  const statusBadge = (status) => {
    const map = {
      Received: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Partial: "bg-blue-100 text-blue-800",
      Waived: "bg-gray-100 text-gray-600",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}
      >
        {status}
      </span>
    );
  };

  const categoryIcon = (cat) => {
    const map = {
      Fuel: "⛽",
      Maintenance: "🔧",
      Repair: "🛠️",
      Insurance: "🛡️",
      "Toll/Parking": "🅿️",
      Cleaning: "🧹",
      Tyres: "⚫",
      Other: "📦",
    };
    return map[cat] || "📦";
  };

  // ── Months for filter ──────────────────────────────────────────────────────
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7));
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800" />
      </div>
    );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Accounting — SafeRide</title>
      </Helmet>

      {/* ── Income Modal ── */}
      {showIncomeModal && (
        <Modal
          title={editingIncome ? "Edit Income Record" : "Add Income Record"}
          onClose={() => {
            setShowIncomeModal(false);
            setEditingIncome(null);
            resetIncomeForm();
          }}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Student / Child</Label>
                <select
                  value={incomeForm.parentId + "||" + incomeForm.childLabel}
                  onChange={(e) => {
                    const [pid, clabel] = e.target.value.split("||");
                    setIncomeForm((p) => ({ ...p, parentId: pid, childLabel: clabel }));
                  }}
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="||">— Select Child —</option>
                  {parents.map((p) => (
                    <option key={p.id} value={`${p.id}||${p.childName}`}>
                      {p.childName} ({p.childClass}) — {p.fullName}
                    </option>
                  ))}
                  {approvedEnrollments.map((e) => {
                    const parent = parents.find(p => p.email === e.email);
                    return (
                      <option key={e.id} value={`${parent?.id || ""}||${e.childName}`}>
                        {e.childName} ({e.childClass}) — {e.parentName} [2nd child]
                      </option>
                    );
                  })}
                </select>
                {incomeForm.childLabel && (
                  <p className="text-xs text-blue-600 mt-1">Recording fee for: <strong>{incomeForm.childLabel}</strong></p>
                )}
              </div>
              <div>
                <Label>Payment Type</Label>
                <select
                  value={incomeForm.type}
                  onChange={(e) =>
                    setIncomeForm((p) => ({ ...p, type: e.target.value }))
                  }
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Monthly Fee</option>
                  <option>Advance Fee</option>
                  <option>Registration Fee</option>
                  <option>Security Deposit</option>
                  <option>Late Payment Fine</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <Label>Amount (Rs.)</Label>
                <Input
                  type="number"
                  value={incomeForm.amount}
                  onChange={(e) =>
                    setIncomeForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  className="mt-1.5"
                  placeholder="5000"
                />
              </div>
              <div>
                <Label>Month (e.g. March 2026)</Label>
                <Input
                  value={incomeForm.month}
                  onChange={(e) =>
                    setIncomeForm((p) => ({ ...p, month: e.target.value }))
                  }
                  className="mt-1.5"
                  placeholder="March 2026"
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <select
                  value={incomeForm.paymentMethod}
                  onChange={(e) =>
                    setIncomeForm((p) => ({
                      ...p,
                      paymentMethod: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Cash</option>
                  <option>Easypaisa</option>
                  <option>JazzCash</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div>
                <Label>Date Received</Label>
                <Input
                  type="date"
                  value={incomeForm.receivedDate}
                  onChange={(e) =>
                    setIncomeForm((p) => ({
                      ...p,
                      receivedDate: e.target.value,
                    }))
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  value={incomeForm.status}
                  onChange={(e) =>
                    setIncomeForm((p) => ({ ...p, status: e.target.value }))
                  }
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Received</option>
                  <option>Pending</option>
                  <option>Partial</option>
                  <option>Waived</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input
                  value={incomeForm.notes}
                  onChange={(e) =>
                    setIncomeForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="mt-1.5"
                  placeholder="Optional notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={saveIncome}
                className="flex-1 bg-blue-800 hover:bg-blue-900 text-white"
              >
                {editingIncome ? "Update" : "Save Record"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowIncomeModal(false);
                  setEditingIncome(null);
                  resetIncomeForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Expense Modal ── */}
      {showExpenseModal && (
        <Modal
          title={editingExpense ? "Edit Expense" : "Add Vehicle Expense"}
          onClose={() => {
            setShowExpenseModal(false);
            setEditingExpense(null);
            resetExpenseForm();
          }}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Van</Label>
                <select
                  value={expenseForm.vanId}
                  onChange={(e) =>
                    setExpenseForm((p) => ({ ...p, vanId: e.target.value }))
                  }
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Select Van —</option>
                  {vans.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vanId} — {v.driverName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Category</Label>
                <select
                  value={expenseForm.category}
                  onChange={(e) =>
                    setExpenseForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Fuel</option>
                  <option>Maintenance</option>
                  <option>Repair</option>
                  <option>Insurance</option>
                  <option>Toll/Parking</option>
                  <option>Cleaning</option>
                  <option>Tyres</option>
                  <option>Driver Salary</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <Label>Amount (Rs.)</Label>
                <Input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  className="mt-1.5"
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={expenseForm.expenseDate}
                  onChange={(e) =>
                    setExpenseForm((p) => ({
                      ...p,
                      expenseDate: e.target.value,
                    }))
                  }
                  className="mt-1.5"
                />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Input
                  value={expenseForm.description}
                  onChange={(e) =>
                    setExpenseForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1.5"
                  placeholder="e.g. Full tank fill-up, oil change..."
                />
              </div>
              <div>
                <Label>Vendor / Shop</Label>
                <Input
                  value={expenseForm.vendor}
                  onChange={(e) =>
                    setExpenseForm((p) => ({ ...p, vendor: e.target.value }))
                  }
                  className="mt-1.5"
                  placeholder="e.g. PSO Station"
                />
              </div>
              <div>
                <Label>Receipt No.</Label>
                <Input
                  value={expenseForm.receiptNo}
                  onChange={(e) =>
                    setExpenseForm((p) => ({ ...p, receiptNo: e.target.value }))
                  }
                  className="mt-1.5"
                  placeholder="Optional"
                />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input
                  value={expenseForm.notes}
                  onChange={(e) =>
                    setExpenseForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="mt-1.5"
                  placeholder="Optional notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={saveExpense}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                {editingExpense ? "Update" : "Save Expense"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowExpenseModal(false);
                  setEditingExpense(null);
                  resetExpenseForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Page ── */}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  📊 SafeRide Accounting
                </h1>
                <p className="text-blue-200 text-sm mt-1">
                  Income collection · Vehicle expenses · Profit & Loss
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">All Time</option>
                  {months.map((m) => (
                    <option key={m} value={m} className="text-gray-900">
                      {new Date(m + "-01").toLocaleDateString("en-PK", {
                        month: "long",
                        year: "numeric",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Income"
              value={fmt(totalIncome)}
              icon={TrendingUp}
              color="border-green-200"
              sub="Received payments"
            />
            <StatCard
              label="Total Expenses"
              value={fmt(totalExpenses)}
              icon={TrendingDown}
              color="border-red-200"
              sub="All vehicle costs"
            />
            <StatCard
              label="Net Profit"
              value={fmt(netProfit)}
              icon={DollarSign}
              color={netProfit >= 0 ? "border-blue-200" : "border-orange-200"}
              sub={
                netProfit >= 0 ? "You're in profit" : "Expenses exceed income"
              }
            />
            <StatCard
              label="Pending Dues"
              value={fmt(pendingIncome)}
              icon={Clock}
              color="border-yellow-200"
              sub={`${income.filter((i) => i.status === "Pending").length} unpaid`}
            />
          </div>

          {/* ── Breakdown Row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income by type */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" /> Income
                Breakdown
              </h3>
              {Object.entries(incomeByType).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No income records yet
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(incomeByType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, amount]) => (
                      <div key={type} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">
                              {type}
                            </span>
                            <span className="font-bold text-gray-900">
                              {fmt(amount)}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (amount / totalIncome) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Expense by category */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-orange-600" /> Expense Breakdown
              </h3>
              {Object.entries(expenseByCategory).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No expense records yet
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(expenseByCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, amount]) => (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="text-lg">{categoryIcon(cat)}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">
                              {cat}
                            </span>
                            <span className="font-bold text-gray-900">
                              {fmt(amount)}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full"
                              style={{
                                width: `${Math.min(100, (amount / totalExpenses) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Per-Student Fee Status ── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Per-Student Fee Status
            </h3>
            {parents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No parents registered yet
              </p>
            ) : (() => {
              // Build unified list: first child from parents + second children from approvedEnrollments
              const allChildren = [
                ...parents.map(p => ({
                  id: p.id,
                  childName: p.childName,
                  childClass: p.childClass,
                  schoolName: p.schoolName,
                  parentName: p.fullName,
                  parentId: p.id,
                  childLabel: p.childName,
                  isSecond: false,
                })),
                ...approvedEnrollments.map(e => {
                  const parent = parents.find(p => p.email === e.email);
                  return {
                    id: e.id,
                    childName: e.childName,
                    childClass: e.childClass,
                    schoolName: e.schoolName,
                    parentName: e.parentName,
                    parentId: parent?.id || '',
                    childLabel: e.childName,
                    isSecond: true,
                  };
                }),
              ];
              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="p-3 text-left font-semibold text-gray-600">Student</th>
                        <th className="p-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Parent</th>
                        <th className="p-3 text-right font-semibold text-gray-600">Paid</th>
                        <th className="p-3 text-right font-semibold text-gray-600">Pending</th>
                        <th className="p-3 text-center font-semibold text-gray-600">Last Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allChildren.map((child) => {
                        const pIncome = income.filter((i) => {
                          if (i.parentId !== child.parentId) return false;
                          const label = (i.childLabel || '').trim();
                          if (child.isSecond) {
                            // Second child: only count records explicitly labelled with this child's name
                            return label === child.childLabel;
                          } else {
                            // Primary child: count records with no label OR labelled with this child's name
                            return !label || label === child.childLabel;
                          }
                        });
                        const paid = pIncome
                          .filter((i) => i.status === "Received")
                          .reduce((s, i) => s + Number(i.amount || 0), 0);
                        const pending = pIncome
                          .filter((i) => i.status === "Pending")
                          .reduce((s, i) => s + Number(i.amount || 0), 0);
                        const last = pIncome
                          .filter((i) => i.status === "Received")
                          .sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate))[0];
                        return (
                          <tr key={child.id} className={`border-b hover:bg-gray-50 transition-colors ${child.isSecond ? 'bg-green-50/30' : ''}`}>
                            <td className="p-3">
                              <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                                {child.isSecond && <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block flex-shrink-0"></span>}
                                {child.childName}
                              </div>
                              <div className="text-xs text-gray-400">{child.childClass} — {child.schoolName}</div>
                            </td>
                            <td className="p-3 hidden sm:table-cell text-gray-600">{child.parentName}</td>
                            <td className="p-3 text-right font-bold text-green-700">{fmt(paid)}</td>
                            <td className="p-3 text-right font-bold text-red-500">
                              {pending > 0 ? fmt(pending) : <span className="text-gray-300">—</span>}
                            </td>
                            <td className="p-3 text-center text-xs text-gray-500">
                              {last ? new Date(last.receivedDate).toLocaleDateString("en-PK") : <span className="text-gray-300">None</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>

          {/* ── Tabs: Income & Expenses ── */}
          <Tabs defaultValue="income" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                <TabsTrigger
                  value="income"
                  className="px-6 py-2 text-sm font-semibold rounded-lg"
                >
                  💰 Income ({income.length})
                </TabsTrigger>
                <TabsTrigger
                  value="expenses"
                  className="px-6 py-2 text-sm font-semibold rounded-lg"
                >
                  🔧 Expenses ({expenses.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Income Tab ── */}
            <TabsContent value="income">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={searchIncome}
                      onChange={(e) => setSearchIncome(e.target.value)}
                      placeholder="Search by parent or type..."
                      className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={exportIncome}
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Download className="w-4 h-4 mr-1" /> Export
                    </Button>
                    <Button
                      onClick={() => {
                        resetIncomeForm();
                        setShowIncomeModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Income
                    </Button>
                  </div>
                </div>

                {filteredIncome.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No income records yet</p>
                    <p className="text-sm mt-1">
                      Click "Add Income" to record a fee payment
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="p-3 text-left font-semibold text-gray-600">
                            Student / Parent
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600">
                            Type
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                            Month
                          </th>
                          <th className="p-3 text-right font-semibold text-gray-600">
                            Amount
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600 hidden sm:table-cell">
                            Method
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                            Date
                          </th>
                          <th className="p-3 text-center font-semibold text-gray-600">
                            Status
                          </th>
                          <th className="p-3 text-right font-semibold text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIncome.map((r) => (
                          <tr
                            key={r.id}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3">
                              <div className="font-semibold text-gray-900">
                                {r.childLabel || r.expand?.parentId?.childName || "—"}
                              </div>
                              <div className="text-xs text-gray-400">
                                {r.expand?.parentId?.fullName || r.parentId}
                              </div>
                            </td>
                            <td className="p-3 text-gray-700">{r.type}</td>
                            <td className="p-3 text-gray-500 hidden md:table-cell">
                              {r.month || "—"}
                            </td>
                            <td className="p-3 text-right font-bold text-gray-900">
                              {fmt(r.amount)}
                            </td>
                            <td className="p-3 text-gray-600 hidden sm:table-cell">
                              {r.paymentMethod}
                            </td>
                            <td className="p-3 text-gray-500 hidden md:table-cell">
                              {r.receivedDate?.split("T")[0]}
                            </td>
                            <td className="p-3 text-center">
                              {statusBadge(r.status)}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => openEditIncome(r)}
                                  className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors text-xs font-medium px-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteIncome(r.id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors text-xs font-medium px-2"
                                >
                                  Del
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-green-50 border-t-2 border-green-200">
                          <td
                            colSpan={3}
                            className="p-3 font-bold text-gray-700"
                          >
                            Total (filtered)
                          </td>
                          <td className="p-3 text-right font-black text-green-700">
                            {fmt(
                              filteredIncome
                                .filter((i) => i.status === "Received")
                                .reduce((s, i) => s + Number(i.amount || 0), 0),
                            )}
                          </td>
                          <td colSpan={4} className="p-3 text-xs text-gray-400">
                            Received only
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── Expenses Tab ── */}
            <TabsContent value="expenses">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={searchExpense}
                      onChange={(e) => setSearchExpense(e.target.value)}
                      placeholder="Search by van, category..."
                      className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={exportExpenses}
                      variant="outline"
                      size="sm"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      <Download className="w-4 h-4 mr-1" /> Export
                    </Button>
                    <Button
                      onClick={() => {
                        resetExpenseForm();
                        setShowExpenseModal(true);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Expense
                    </Button>
                  </div>
                </div>

                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No expense records yet</p>
                    <p className="text-sm mt-1">
                      Click "Add Expense" to record fuel, maintenance etc.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="p-3 text-left font-semibold text-gray-600">
                            Category
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600">
                            Van
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                            Description
                          </th>
                          <th className="p-3 text-right font-semibold text-gray-600">
                            Amount
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600 hidden sm:table-cell">
                            Vendor
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                            Date
                          </th>
                          <th className="p-3 text-left font-semibold text-gray-600 hidden lg:table-cell">
                            Receipt
                          </th>
                          <th className="p-3 text-right font-semibold text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.map((r) => (
                          <tr
                            key={r.id}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3">
                              <span className="mr-1.5">
                                {categoryIcon(r.category)}
                              </span>
                              <span className="font-semibold text-gray-900">
                                {r.category}
                              </span>
                            </td>
                            <td className="p-3 text-gray-700">
                              {r.expand?.vanId?.vanId || r.vanId || "—"}
                            </td>
                            <td className="p-3 text-gray-500 hidden md:table-cell max-w-xs truncate">
                              {r.description || "—"}
                            </td>
                            <td className="p-3 text-right font-bold text-red-600">
                              {fmt(r.amount)}
                            </td>
                            <td className="p-3 text-gray-600 hidden sm:table-cell">
                              {r.vendor || "—"}
                            </td>
                            <td className="p-3 text-gray-500 hidden md:table-cell">
                              {r.expenseDate?.split("T")[0]}
                            </td>
                            <td className="p-3 text-gray-400 hidden lg:table-cell text-xs">
                              {r.receiptNo || "—"}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => openEditExpense(r)}
                                  className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors text-xs font-medium px-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteExpense(r.id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors text-xs font-medium px-2"
                                >
                                  Del
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-red-50 border-t-2 border-red-200">
                          <td
                            colSpan={3}
                            className="p-3 font-bold text-gray-700"
                          >
                            Total (filtered)
                          </td>
                          <td className="p-3 text-right font-black text-red-600">
                            {fmt(
                              filteredExpenses.reduce(
                                (s, e) => s + Number(e.amount || 0),
                                0,
                              ),
                            )}
                          </td>
                          <td colSpan={4} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AccountingPage;