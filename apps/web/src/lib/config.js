/**
 * saferide/web/src/lib/config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all business constants.
 * Previously these were scattered across ParentDashboard, VanTrackingPage,
 * PaymentPage, ChatbotWidget, and every pb_hook.
 * Change them here once; the whole frontend reflects the update.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SAFERIDE = {
  name:        'SafeRide School Transport',
  phone:       '+92 03014202944',
  whatsapp:    '9203014202944',
  email:       'support@saferide.com.pk',
  website:     'https://saferide.com.pk',
  address:     'Lake City, Lahore, Pakistan',
  portalUrl:   'https://saferide.com.pk/login',

  bank: {
    name:    'Meezan Bank',
    title:   'SafeRide Transport',
    account: '0123456789',
    iban:    'PK34MEZN00000123456789',
  },

  merchants: {
    easypaisa: 'SAFERIDE001',
    jazzcash:  'SAFERIDE_JAZZ_001',
  },

  /** Monthly fee default — used when no payment record exists yet */
  defaultMonthlyFee: 5000,
};