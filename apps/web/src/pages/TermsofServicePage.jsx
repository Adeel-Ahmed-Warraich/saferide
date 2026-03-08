import React from 'react';
import { Helmet } from 'react-helmet';
import { FileText, ChevronRight } from 'lucide-react';

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
  { id: 'acceptance',    title: '1. Acceptance of Terms' },
  { id: 'services',     title: '2. Our Services' },
  { id: 'eligibility',  title: '3. Eligibility & Enrollment' },
  { id: 'obligations',  title: '4. Parent Obligations' },
  { id: 'payments',     title: '5. Fees & Payments' },
  { id: 'cancellation', title: '6. Cancellation & Suspension' },
  { id: 'safety',       title: '7. Safety Rules & Conduct' },
  { id: 'liability',    title: '8. Limitation of Liability' },
  { id: 'portal',       title: '9. Parent Portal Use' },
  { id: 'intellectual', title: '10. Intellectual Property' },
  { id: 'governing',    title: '11. Governing Law' },
  { id: 'contact',      title: '12. Contact Us' },
];

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service — SafeRide School Transport</title>
        <meta name="description" content="SafeRide School Transport terms of service. Read our terms and conditions for using our school van transport service in Lake City, Lahore." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms of Service</h1>
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
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contents</p>
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

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-10">
              <p className="text-sm text-amber-800 leading-relaxed">
                Please read these Terms of Service carefully before enrolling your child with SafeRide or
                using our parent portal. By submitting an enrollment form or using our services, you agree
                to be bound by these terms. If you do not agree, please do not use our services.
              </p>
            </div>

            <Section id="acceptance" title="1. Acceptance of Terms">
              <p>
                These Terms of Service (<strong>"Terms"</strong>) constitute a legally binding agreement
                between you (<strong>"Parent," "Guardian,"</strong> or <strong>"User"</strong>) and
                SafeRide School Transport (<strong>"SafeRide," "we," "us," or "our"</strong>), operating
                in Lake City, Lahore, Pakistan.
              </p>
              <p>
                By enrolling your child, creating a parent portal account, or using any of our services,
                you confirm that you have read, understood, and agree to be bound by these Terms and our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </p>
            </Section>

            <Section id="services" title="2. Our Services">
              <p>SafeRide provides school transport services including:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Scheduled morning and afternoon school van service for enrolled children</li>
                <li>GPS-based real-time van tracking via the parent portal</li>
                <li>Monthly fee payment processing via the parent portal</li>
                <li>Service notifications and updates via the parent portal</li>
                <li>Customer support via phone, WhatsApp, and email</li>
              </ul>
              <p className="mt-3">
                We currently serve Lake City and nearby schools within approximately 4 km. Service
                availability is subject to route capacity and our operational coverage area. SafeRide
                reserves the right to modify, expand, or discontinue services at any time with reasonable
                prior notice.
              </p>
            </Section>

            <Section id="eligibility" title="3. Eligibility & Enrollment">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Services are available for school-age children whose parents or guardians reside within our service area</li>
                <li>Enrollment is subject to availability of seats on the relevant route and shift</li>
                <li>SafeRide reserves the right to accept or decline any enrollment application at our discretion</li>
                <li>You must provide accurate and complete information during enrollment. Providing false information may result in immediate termination of services</li>
                <li>Any change in your child's school, address, or shift preference must be communicated to us in writing at least 5 business days in advance</li>
              </ul>
            </Section>

            <Section id="obligations" title="4. Parent Obligations">
              <p>As a parent or guardian, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Ensure your child is ready at the designated pickup point on time. The van will not wait more than 2 minutes at any stop</li>
                <li>Ensure your child behaves respectfully toward the driver and other students in the van</li>
                <li>Notify SafeRide at least 1 hour in advance if your child will not be using the service on a particular day</li>
                <li>Ensure your child is received by an authorised adult at the drop-off point. SafeRide is not responsible for a child who is not received upon arrival</li>
                <li>Keep your contact information and child's details up to date in the parent portal</li>
                <li>Not share your parent portal login credentials with unauthorised persons</li>
                <li>Pay monthly fees on time as per the payment schedule</li>
              </ul>
            </Section>

            <Section id="payments" title="5. Fees & Payments">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Monthly transport fees are due within the first <strong>5 days</strong> of each month</li>
                <li>Fees may vary based on distance, route, and shift. Your applicable fee will be displayed in your parent portal</li>
                <li>Accepted payment methods: Easypaisa, JazzCash, and bank deposit via the parent portal</li>
                <li>All payments must be submitted through the parent portal with a valid transaction ID or receipt</li>
                <li>Late payments may incur a late fee as notified by SafeRide</li>
                <li>If fees remain unpaid for more than <strong>10 days</strong> after the due date, SafeRide reserves the right to suspend transport service until the outstanding balance is cleared</li>
                <li>Fees paid are non-refundable except where SafeRide cancels the service</li>
                <li>SafeRide is not responsible for any charges imposed by your bank or payment provider</li>
              </ul>
            </Section>

            <Section id="cancellation" title="6. Cancellation & Suspension">
              <p><strong className="text-gray-800">By Parent / Guardian:</strong></p>
              <ul className="list-disc pl-5 space-y-1.5 mb-3">
                <li>You may cancel your enrollment at any time by providing <strong>15 days written notice</strong> to SafeRide</li>
                <li>Fees paid for the current month are non-refundable upon cancellation</li>
                <li>Security deposits, if applicable, will be refunded within 14 business days of cancellation, provided no outstanding dues remain</li>
              </ul>
              <p><strong className="text-gray-800">By SafeRide:</strong></p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>We may suspend or terminate services immediately in cases of: non-payment of fees, misconduct by the child, provision of false information, or circumstances beyond our control</li>
                <li>We may temporarily suspend services due to public holidays, school closures, severe weather, vehicle maintenance, or other operational reasons. We will notify parents in advance wherever possible</li>
                <li>In case of service cancellation by SafeRide without cause, a pro-rated refund for unused days will be provided</li>
              </ul>
            </Section>

            <Section id="safety" title="7. Safety Rules & Conduct">
              <p>For the safety of all children, the following rules must be observed:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Children must remain seated with seatbelts fastened (where available) at all times during transit</li>
                <li>Children must not distract the driver, shout, or engage in behaviour that compromises vehicle safety</li>
                <li>Eating, drinking (other than water), and smoking are strictly prohibited in the van</li>
                <li>Any bullying, harassment, or aggressive behaviour toward other students or the driver will result in immediate suspension from the service</li>
                <li>Children should not carry valuable items or large sums of money. SafeRide is not liable for lost or stolen personal belongings</li>
                <li>In case of any medical condition or allergy, parents must inform SafeRide in writing at the time of enrollment</li>
              </ul>
            </Section>

            <Section id="liability" title="8. Limitation of Liability">
              <p>
                SafeRide will take all reasonable precautions to ensure the safety and well-being of
                children in our care. However:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>SafeRide shall not be liable for delays caused by traffic, road conditions, weather, or other circumstances beyond our reasonable control</li>
                <li>SafeRide shall not be liable for any loss, damage, or injury caused by the actions of the child or other passengers</li>
                <li>Our liability for any claim arising from the provision of transport services shall not exceed the monthly fee paid for the month in which the incident occurred</li>
                <li>SafeRide is not responsible for a child who is not collected at the drop-off point by an authorised adult</li>
                <li>Parents are responsible for ensuring their child's health is suitable for travel. SafeRide drivers are not qualified to administer medical treatment</li>
              </ul>
            </Section>

            <Section id="portal" title="9. Parent Portal Use">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Your parent portal account is for your personal use only and must not be shared with others</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials</li>
                <li>You must notify SafeRide immediately if you suspect unauthorised access to your account</li>
                <li>SafeRide reserves the right to suspend or terminate portal access in cases of misuse or security concerns</li>
                <li>The GPS tracking feature is provided for informational purposes. Minor variations in displayed location are possible and do not constitute a service failure</li>
              </ul>
            </Section>

            <Section id="intellectual" title="10. Intellectual Property">
              <p>
                All content on the SafeRide website and parent portal — including text, logos, graphics,
                and software — is the property of SafeRide School Transport and is protected by applicable
                intellectual property laws. You may not reproduce, distribute, or create derivative works
                from our content without our prior written consent.
              </p>
            </Section>

            <Section id="governing" title="11. Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                Islamic Republic of Pakistan. Any disputes arising from these Terms or your use of
                SafeRide services shall be subject to the exclusive jurisdiction of the courts of
                Lahore, Punjab, Pakistan.
              </p>
              <p>
                We encourage parents to first contact us directly to resolve any disputes amicably
                before pursuing legal action.
              </p>
            </Section>

            <Section id="contact" title="12. Contact Us">
              <p>
                If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfServicePage;