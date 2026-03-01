// ─────────────────────────────────────────────────────────────────────────────
// SafeRide Mock Data & Demo Mode
// Set DEMO_MODE = true to use fake data instead of real PocketBase calls
// Set DEMO_MODE = false when your backend is fully configured
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_MODE = false; // ← flip to true to enable mock mode

// ── Mock Parent Account ───────────────────────────────────────────────────────
export const MOCK_PARENT = {
  id: 'mock_parent_001',
  collectionName: 'parents',
  fullName: 'Ahmed Ali Warraich',
  email: 'parent@saferide.com.pk',
  phoneNumber: '+92 300 1234567',
  childName: 'Zara Ahmed',
  childClass: 'Grade 5',
  schoolName: 'Beaconhouse School Lake City',
  homeAddress: 'House 12, Block C, Lake City, Lahore',
  preferredShift: 'Morning',
  enrollmentStatus: 'Active',
};

// ── Mock Payments ─────────────────────────────────────────────────────────────
export const MOCK_PAYMENTS = [
  {
    id: 'pay_001',
    parentId: 'mock_parent_001',
    amount: 5000,
    dueDate: new Date().toISOString(),
    paymentMethod: 'Easypaisa',
    status: 'Pending',
    transactionId: 'TXN-583920',
    created: new Date().toISOString(),
  },
  {
    id: 'pay_002',
    parentId: 'mock_parent_001',
    amount: 5000,
    dueDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    paymentMethod: 'JazzCash',
    status: 'Paid',
    transactionId: 'TXN-472819',
    created: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'pay_003',
    parentId: 'mock_parent_001',
    amount: 5000,
    dueDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    paymentMethod: 'BankDeposit',
    status: 'Paid',
    transactionId: 'TXN-361728',
    created: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
];

// ── Mock Van & Assignment ─────────────────────────────────────────────────────
export const MOCK_VAN = {
  id: 'van_001',
  vanId: 'V-001',
  driverName: 'Muhammad Asif',
  driverPhone: '+92 311 9876543',
  licensePlate: 'LHR-2341',
  capacity: 8,
  status: 'Active',
};

export const MOCK_ASSIGNMENT = {
  id: 'assign_001',
  parentId: 'mock_parent_001',
  vanId: 'van_001',
  status: 'Active',
  departureTime: '2:10 PM',
  expand: { vanId: MOCK_VAN },
};

// ── Mock GPS Location ─────────────────────────────────────────────────────────
export const MOCK_GPS = {
  id: 'gps_001',
  vanId: 'van_001',
  latitude: 31.5546,   // Lake City, Lahore coords
  longitude: 74.3048,
  locationName: 'Main Boulevard, Lake City',
  status: 'On the way',
  eta: '~8 mins',
  created: new Date().toISOString(),
};

// ── Mock Notifications ────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_001',
    title: 'Fee Reminder - March 2026',
    message: 'Your monthly transport fee of Rs. 5,000 is due on March 5, 2026. Please pay via your dashboard.',
    type: 'FeeReminder',
    isRead: false,
    created: new Date().toISOString(),
  },
  {
    id: 'notif_002',
    title: 'Van Delayed Today',
    message: 'Van V-001 is running approximately 10 minutes late today due to traffic near Main Boulevard.',
    type: 'PickupDelay',
    isRead: false,
    created: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif_003',
    title: 'Payment Confirmed',
    message: 'Your payment of Rs. 5,000 for February 2026 has been confirmed. Thank you!',
    type: 'PaymentConfirmation',
    isRead: true,
    created: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'notif_004',
    title: 'Welcome to SafeRide!',
    message: 'Your enrollment has been approved. Van V-001 will pick up Zara from your address every morning.',
    type: 'Broadcast',
    isRead: true,
    created: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
];

// ── Mock Admin Data ───────────────────────────────────────────────────────────
export const MOCK_PARENTS_LIST = [
  { ...MOCK_PARENT, id: 'p1', fullName: 'Ahmed Ali', childName: 'Zara', childClass: 'Grade 5', enrollmentStatus: 'Active', phoneNumber: '+92 300 1111111' },
  { id: 'p2', fullName: 'Sara Khan', email: 'sara@example.com', childName: 'Ali Hassan', childClass: 'Grade 3', schoolName: 'LACAS', enrollmentStatus: 'Active', phoneNumber: '+92 300 2222222', preferredShift: 'Both', homeAddress: 'Block D, Lake City' },
  { id: 'p3', fullName: 'Usman Raza', email: 'usman@example.com', childName: 'Hania', childClass: 'Grade 7', schoolName: 'Divisional Public School', enrollmentStatus: 'Pending', phoneNumber: '+92 300 3333333', preferredShift: 'Morning', homeAddress: 'Block A, Lake City' },
  { id: 'p4', fullName: 'Fatima Malik', email: 'fatima@example.com', childName: 'Omar', childClass: 'Grade 2', schoolName: 'Beaconhouse', enrollmentStatus: 'Active', phoneNumber: '+92 300 4444444', preferredShift: 'Afternoon', homeAddress: 'Block F, Lake City' },
];

export const MOCK_PAYMENTS_LIST = [
  { id: 'mp1', amount: 5000, paymentMethod: 'Easypaisa', status: 'Pending', transactionId: 'TXN-001', created: new Date().toISOString(), expand: { parentId: MOCK_PARENTS_LIST[0] } },
  { id: 'mp2', amount: 5000, paymentMethod: 'JazzCash', status: 'Paid', transactionId: 'TXN-002', created: new Date(Date.now() - 86400000).toISOString(), expand: { parentId: MOCK_PARENTS_LIST[1] } },
  { id: 'mp3', amount: 5000, paymentMethod: 'BankDeposit', status: 'PendingAdminApproval', transactionId: 'TXN-003', created: new Date(Date.now() - 172800000).toISOString(), expand: { parentId: MOCK_PARENTS_LIST[2] } },
  { id: 'mp4', amount: 5000, paymentMethod: 'Easypaisa', status: 'Paid', transactionId: 'TXN-004', created: new Date(Date.now() - 259200000).toISOString(), expand: { parentId: MOCK_PARENTS_LIST[3] } },
];

export const MOCK_VANS_LIST = [
  { id: 'v1', vanId: 'V-001', driverName: 'Muhammad Asif', driverPhone: '+92 311 9876543', licensePlate: 'LHR-2341', capacity: 8, status: 'Active' },
  { id: 'v2', vanId: 'V-002', driverName: 'Tariq Mehmood', driverPhone: '+92 321 8765432', licensePlate: 'LHR-5678', capacity: 7, status: 'Active' },
  { id: 'v3', vanId: 'V-003', driverName: 'Khalid Hussain', driverPhone: '+92 333 7654321', licensePlate: 'LHR-9012', capacity: 8, status: 'Maintenance' },
];

// ── Demo Mode Banner Component helper ────────────────────────────────────────
export const DEMO_BANNER_MSG = '🧪 Demo Mode — showing sample data. Real PocketBase data will appear when backend is connected.';
