import React from 'react';
import { Helmet } from 'react-helmet';
import { Shield, ChevronRight } from 'lucide-react';

const Section = ({ id, title, children }) => (
  <section id={id} className="mb-10 scroll-mt-24">
    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
      {title}
    </h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
  </section>
);

const sections = [
  { id: 'information', title: '1. Information We Collect' },
  { id: 'usage',       title: '2. How We Use Your Information' },
  { id: 'sharing',     title: '3. Information Sharing' },
  { id: 'security',    title: '4. Data Security' },
  { id: 'retention',   title: '5. Data Retention' },
  { id: 'rights',      title: '6. Your Rights' },
  { id: 'cookies',     title: '7. Cookies' },
  { id: 'children',    title: '8. Children\'s Privacy' },
  { id: 'changes',     title: '9. Changes to This Policy' },
  { id: 'contact',     title: '10. Contact Us' },
];

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — SafeRide School Transport</title>
        <meta name="description" content="SafeRide School Transport privacy policy. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <Shield className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-blue-100 text-sm">
            Effective Date: January 1, 2026 &nbsp;·&nbsp; Last Updated: March 1, 2026
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar TOC */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="sticky top-24 bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-3 font-bold">Contents</p>
              <ul className="space-y-2">
                {sections.map(s => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-xs text-gray-600 hover:text-blue-600 transition-colors block leading-relaxed"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-10">
              <p className="text-sm text-blue-800 leading-relaxed">
                SafeRide School Transport (<strong>"SafeRide," "we," "us," or "our"</strong>) is committed to
                protecting the privacy of the parents, guardians, and children who use our services.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you use our website at <strong>saferide.com.pk</strong> and our parent portal.
              </p>
            </div>

            <Section id="information" title="1. Information We Collect">
              <p><strong className="text-gray-800">Personal Information You Provide:</strong></p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Parent / Guardian:</strong> Full name, email address, phone number, home address</li>
                <li><strong>Child:</strong> Name, class/grade, school name, special instructions or medical notes</li>
                <li><strong>Account:</strong> Email address and password for the parent portal</li>
                <li><strong>Payments:</strong> Payment method, transaction reference, receipt images (we do not store full card or bank account numbers)</li>
                <li><strong>Communications:</strong> Messages sent via our contact form or support channels</li>
              </ul>
              <p className="mt-3"><strong className="text-gray-800">Information Collected Automatically:</strong></p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Browser type, device type, and operating system</li>
                <li>IP address and approximate location</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referral source (how you found our website)</li>
              </ul>
              <p className="mt-3"><strong className="text-gray-800">GPS and Location Data:</strong></p>
              <p>
                When GPS tracking is active during transport hours, we collect real-time vehicle location
                data. This data is used solely to display van location to authorised parents and is
                not stored beyond the active journey.
              </p>
            </Section>

            <Section id="usage" title="2. How We Use Your Information">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To provide and manage school transport services for your child</li>
                <li>To create and manage your parent portal account</li>
                <li>To process and verify monthly fee payments</li>
                <li>To send service-related notifications (van departure, arrival, delays)</li>
                <li>To send payment receipts, enrollment confirmations, and important updates</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve our website, services, and safety procedures</li>
                <li>To comply with legal obligations</li>
              </ul>
              <p className="mt-3">
                We will <strong>never</strong> use your information for unsolicited marketing or sell it to
                any third party for advertising purposes.
              </p>
            </Section>

            <Section id="sharing" title="3. Information Sharing">
              <p>
                SafeRide does not sell, trade, or rent your personal information to any third party.
                We may share your information only in the following limited circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Service Providers:</strong> We use trusted third-party services (hosting,
                  email delivery) that process data on our behalf under strict confidentiality obligations.
                </li>
                <li>
                  <strong>Van Drivers:</strong> Drivers are provided only with the child's name and
                  pickup/drop-off address necessary to perform their duties. No financial or contact
                  details beyond pickup address are shared.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required by law,
                  court order, or government authority, or to protect the safety of children in our care.
                </li>
                <li>
                  <strong>Emergency Situations:</strong> In case of an accident or medical emergency,
                  relevant information may be shared with emergency services or healthcare providers.
                </li>
              </ul>
            </Section>

            <Section id="security" title="4. Data Security">
              <p>
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>All data is transmitted over HTTPS encrypted connections</li>
                <li>Passwords are hashed and never stored in plain text</li>
                <li>Parent portal access is protected by email and password authentication</li>
                <li>Our servers are hosted on secured infrastructure with regular backups</li>
                <li>Access to your data is restricted to authorised SafeRide staff only</li>
              </ul>
              <p className="mt-3">
                While we take reasonable measures to protect your information, no method of
                transmission over the internet is 100% secure. We encourage you to use a strong,
                unique password for your parent portal account.
              </p>
            </Section>

            <Section id="retention" title="5. Data Retention">
              <p>
                We retain your personal information for as long as your child is enrolled with SafeRide
                and for a reasonable period thereafter, or as required by applicable law.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Active parent accounts: retained for the duration of service plus 1 year</li>
                <li>Payment records: retained for 5 years for accounting and legal purposes</li>
                <li>Contact form messages: retained for 1 year</li>
                <li>GPS location data: not retained beyond the active journey session</li>
              </ul>
              <p className="mt-3">
                You may request deletion of your account and personal data at any time by contacting us
                at <a href="mailto:info@saferide.com.pk" className="text-blue-600 hover:underline">info@saferide.com.pk</a>.
              </p>
            </Section>

            <Section id="rights" title="6. Your Rights">
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Access</strong> the personal information we hold about you and your child</li>
                <li><strong>Correct</strong> inaccurate or incomplete information</li>
                <li><strong>Delete</strong> your account and associated data</li>
                <li><strong>Withdraw consent</strong> for processing where consent was the basis</li>
                <li><strong>Object</strong> to certain uses of your information</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:info@saferide.com.pk" className="text-blue-600 hover:underline">
                  info@saferide.com.pk
                </a>{' '}
                or call us at <strong>+92 0301 4202944</strong>. We will respond within 7 business days.
              </p>
            </Section>

            <Section id="cookies" title="7. Cookies">
              <p>
                Our website uses minimal cookies that are necessary for the site to function correctly:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Session cookies:</strong> To keep you logged in to the parent portal</li>
                <li><strong>Preference cookies:</strong> To remember your display preferences</li>
              </ul>
              <p className="mt-3">
                We do not use advertising or tracking cookies. You can disable cookies in your browser
                settings; however, some portal features may not function correctly without them.
              </p>
            </Section>

            <Section id="children" title="8. Children's Privacy">
              <p>
                SafeRide services are designed for school-age children, but our website and parent
                portal accounts are intended for use by parents and guardians only. We do not knowingly
                collect personal information directly from children under the age of 13.
              </p>
              <p>
                All child-related information (name, class, school) is provided by the parent or
                guardian during enrollment and is used solely for the purpose of delivering transport
                services safely.
              </p>
            </Section>

            <Section id="changes" title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices
                or legal requirements. When we make material changes, we will notify you by:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Posting the updated policy on this page with a new effective date</li>
                <li>Sending a notification to your registered email address</li>
              </ul>
              <p className="mt-3">
                We encourage you to review this policy periodically. Continued use of our services
                after changes are posted constitutes your acceptance of the updated policy.
              </p>
            </Section>

            <Section id="contact" title="10. Contact Us">
              <p>
                If you have any questions, concerns, or complaints about this Privacy Policy or how
                we handle your personal information, please contact us:
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mt-3 space-y-2">
                <p><strong className="text-gray-800">SafeRide School Transport</strong></p>
                <p>📍 Lake City, Lahore, Punjab, Pakistan</p>
                <p>📧 <a href="mailto:info@saferide.com.pk" className="text-blue-600 hover:underline">info@saferide.com.pk</a></p>
                <p>📞 <a href="tel:+9203014202944" className="text-blue-600 hover:underline">+92 0301 4202944</a></p>
                <p>🌐 <a href="https://saferide.com.pk" className="text-blue-600 hover:underline">saferide.com.pk</a></p>
              </div>
            </Section>

          </main>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;