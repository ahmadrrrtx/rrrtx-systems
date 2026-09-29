/**
 * Legal page content.
 *
 * These strings describe what this application actually does, verified against
 * the source: the forms that exist, the fields they store, the cookies that are
 * set, and the third parties that receive data. If a form, cookie or provider
 * changes, this file must change with it.
 *
 * Deliberately absent: company registration numbers, registered addresses,
 * named jurisdictions, certification claims and retention promises that the
 * code does not enforce. Where a fact is not established, the text says so
 * rather than inventing one.
 */

export const LEGAL_CONTACT_EMAIL = "contact@rrrtx-systems.com";
export const LEGAL_LAST_UPDATED = "29 September 2026";

/** The single source of truth for "when did this page last change". */
export const LEGAL_UPDATED_ISO = "2026-09-29";

const contactBlock = `
  <h2>Contact</h2>
  <p>Questions about this policy, or a request relating to your information, can be sent to
  <a href="mailto:${LEGAL_CONTACT_EMAIL}">${LEGAL_CONTACT_EMAIL}</a>.
  We aim to respond to privacy and legal enquiries within 30 days.</p>
`;

export const PRIVACY_CONTENT = `
  <p><strong>Last updated: ${LEGAL_LAST_UPDATED}</strong></p>

  <p>RRRTX SYSTEMS ("RRRTX", "we", "us") operates this website and provides custom software,
  ecommerce, automation and lead-generation engineering services. This policy explains what
  information we collect through this website, why we collect it, how long we keep it, and the
  choices available to you. It describes the behaviour of this website as it is actually built.</p>

  <h2>Information you provide to us</h2>
  <p>We only collect information you choose to submit through the forms on this website:</p>
  <ul>
    <li><strong>Project enquiry form.</strong> Your name, email address, and the service, budget
    range and description you select or write. Company name is optional.</li>
    <li><strong>Remote website audit request.</strong> Your name, email address and website URL,
    plus an optional business type and the area you would like reviewed.</li>
    <li><strong>ROI calculator.</strong> The figures you enter to model a scenario. If you choose
    to submit your name and email with the result, those are stored alongside the calculation.
    You can use the calculator without submitting your details.</li>
    <li><strong>Resource downloads.</strong> If a resource is marked as gated, your name and email
    address, recorded against the specific resource you requested.</li>
    <li><strong>Partner application.</strong> Your name, email address, country, and the answers you
    give about your referral background. Phone, role, company, website and LinkedIn are optional.</li>
    <li><strong>Partner portal.</strong> If your application is approved, we create an account for
    you and store a password hash, your rank and commission settings, and the referrals and
    commission records associated with your account.</li>
    <li><strong>Certificate verification.</strong> When you look up a partner document, we process
    the certificate identifier you supply in order to return its status. We do not require or
    collect your identity to do this.</li>
  </ul>

  <h2>Information stored in your browser</h2>
  <p>Two things are kept on your own device rather than on our servers. Your cookie consent choice is
  stored in a first-party cookie. Separately, our downloadable conversion checklist saves your
  tick-box progress in your browser's local storage so it survives a refresh; it holds only which
  items you have ticked and is never sent to us. Both can be removed by clearing your browser data.
  See the <a href="/cookies">Cookie Policy</a> for the full list.</p>

  <h2>Information collected automatically</h2>
  <p>Our hosting and content delivery providers process standard request information — such as IP
  address, user agent, the page requested and the time of the request — in order to serve the site,
  apply security controls and protect against abuse. This information is also used to enforce
  limits on how often a given network may submit a form.</p>
  <p>If you consent to analytics, we load Google Analytics 4, which records how pages are used,
  including approximate location derived from IP address, device and browser characteristics, and
  interactions with the site. Analytics is described in more detail in our
  <a href="/cookies">Cookie Policy</a>.</p>
  <p>We also use Vercel Web Analytics, which reports aggregate page views and Core Web Vitals
  without setting cookies or building a cross-site profile of you. Like Google Analytics, it is
  loaded only after you accept analytics in the cookie banner.</p>

  <h2>Why we use it</h2>
  <ul>
    <li>To respond to your enquiry, audit request or partner application, and to discuss a possible engagement.</li>
    <li>To deliver a resource you requested.</li>
    <li>To administer the Partner Network, including referral tracking, commission records and
    issuing and verifying partner documents.</li>
    <li>To operate, secure, diagnose and improve the website, and to prevent spam and abuse.</li>
    <li>To understand, in aggregate, which pages are useful — only where you have consented.</li>
    <li>To meet our own accounting, tax and legal record-keeping obligations.</li>
  </ul>

  <h2>Legal bases</h2>
  <p>Where the GDPR or UK GDPR applies, we rely on the following bases. We process enquiry,
  audit, partner-application and resource-download information because it is necessary to take
  steps at your request before entering into a contract, and because we have a legitimate interest
  in responding to business enquiries and operating our services. We process analytics information
  on the basis of your consent, which you may withdraw at any time. We process records we are
  legally required to keep in order to comply with a legal obligation.</p>
  <p>Where India's Digital Personal Data Protection Act applies, we process information you submit
  on the basis of the consent you give when you submit a form, and we use it only for the purpose
  you submitted it for.</p>

  <h2>Who we share it with</h2>
  <p>We do not sell your personal information, and we do not share it for third-party advertising.
  We use a small number of service providers who process information on our instructions:</p>
  <ul>
    <li><strong>Vercel</strong> — hosting, content delivery and web analytics.</li>
    <li><strong>Cloudflare</strong> — content delivery, caching and network security.</li>
    <li><strong>Turso (libSQL)</strong> — database hosting for the content, enquiry and partner records described above.</li>
    <li><strong>Google Analytics</strong> — website analytics, only after you consent.</li>
    <li><strong>Resend</strong> — transactional email used to notify us when a form is submitted. It is only active if configured.</li>
  </ul>
  <p>We may also disclose information where we are legally required to do so, or where it is
  necessary to establish, exercise or defend a legal claim.</p>

  <h2>International transfers</h2>
  <p>These providers operate globally, so information you submit may be stored or processed outside
  your country, including in the United States and the European Union. Where personal data
  originating in the EEA or UK is transferred, we rely on the safeguards those providers offer
  under their data processing terms. If you would like specific detail for your situation, contact
  us using the address below.</p>

  <h2>How long we keep it</h2>
  <p>We keep enquiry and audit submissions for as long as needed to respond and to maintain a
  reasonable record of business contact. Partner application and Partner Network records are kept
  for as long as the partner relationship is active and for a reasonable period afterwards, so
  that commission history and issued documents remain verifiable. When information is no longer
  needed, we delete it. If you would like us to delete a specific submission, contact us and we
  will do so unless we are required to retain it.</p>

  <h2>Security</h2>
  <p>Information is transmitted over HTTPS. Access to the administrative dashboard and the partner
  portal requires a signed, expiring session and a password stored only as a bcrypt hash. Access to
  submitted data is restricted to authorised personnel. No system can be guaranteed to be perfectly
  secure, but we apply these controls reasonably and review them as the site evolves.</p>

  <h2>Your rights</h2>
  <p>Depending on where you live, you may have the right to request a copy of the information we
  hold about you, to have inaccurate information corrected, to have information erased, to restrict
  or object to certain processing, and to receive information you provided in a portable format.
  You may withdraw analytics consent at any time using the cookie settings link in the site footer.
  To exercise any of these rights, email us using the address below. You also have the right to
  complain to your local data protection authority.</p>

  <h2>Children</h2>
  <p>This website and our services are intended for businesses and professional audiences. They are
  not directed at children, and we do not knowingly collect personal information from children.</p>

  <h2>Changes to this policy</h2>
  <p>If our data practices change, we will update this page and revise the date above. Material
  changes affecting how we use information you have already submitted will be communicated to you
  where we are able to do so.</p>

  ${contactBlock}
`;

export const TERMS_CONTENT = `
  <p><strong>Last updated: ${LEGAL_LAST_UPDATED}</strong></p>

  <p>These terms govern your use of the rrrtx-systems.com website and the tools and materials
  published on it. They are separate from any project agreement: professional services provided by
  RRRTX SYSTEMS are delivered under a written proposal, statement of work or contract, and where
  those documents conflict with these website terms, the project documents prevail.</p>

  <h2>Using this website</h2>
  <p>You may browse the website, use the free tools, request resources and submit enquiries for
  lawful business purposes. You agree not to:</p>
  <ul>
    <li>attempt to gain unauthorised access to any part of the website, its administrative
    interfaces, or the Partner Network portal;</li>
    <li>probe, scan or test the vulnerability of the website without our prior written permission;</li>
    <li>submit false, misleading or fraudulent information through any form, or submit a partner
    application on behalf of someone else without authority;</li>
    <li>use automated systems to submit forms, scrape the site at a volume that degrades it, or
    circumvent the rate limits and abuse controls we apply;</li>
    <li>reproduce, resell or redistribute our content, tools or partner documents except as
    permitted below.</li>
  </ul>

  <h2>Free tools and resources</h2>
  <p>The ROI calculator, remote website audit and downloadable resources are provided as general
  information and planning aids. The ROI calculator produces a directional scenario estimate from
  the assumptions you enter. It is not a forecast, a quotation or a guarantee of any result, and its
  output should not be treated as financial or investment advice. Website audit responses are
  reviewed by a person and reflect our own assessment at the time; they are not a formal security
  assessment, legal opinion or compliance certification.</p>

  <h2>Engagements, scope and payment</h2>
  <p>Each project is scoped individually. A written proposal or statement of work defines the
  deliverables, assumptions, timeline and fees. Work does not begin until the required deposit has
  been received and the scope has been agreed in writing. Payments are scheduled against the
  milestones set out in that document. Unless a proposal states otherwise, fees are quoted in the
  currency shown on the proposal and exclude taxes, third-party licence fees and paid media spend.</p>
  <p>Because our work is custom, changes to agreed scope are handled through a written change
  request that records the effect on fees and timeline. Payment and cancellation terms, including
  treatment of deposits and completed milestones, are set out in the
  <a href="/refunds">Refund and Cancellation Policy</a>.</p>

  <h2>Client responsibilities</h2>
  <p>Projects depend on timely input from you. This typically includes content, brand assets,
  access to systems and accounts, and decisions at review points. Delays in providing these may
  affect the timeline. You are responsible for ensuring that any material you supply is accurate
  and that you hold the rights necessary for us to use it.</p>

  <h2>Intellectual property</h2>
  <p>The design, copy, illustrations, code samples, tools and other materials published on this
  website remain the property of RRRTX SYSTEMS or their respective licensors, and are protected by
  copyright and other laws. You may read them, link to them and use the free tools for your own
  business assessment.</p>
  <p>Ownership of project deliverables is governed by the applicable project agreement, which
  states what transfers to the client and on what conditions — typically on full payment. Unless a
  project agreement says otherwise, we retain ownership of our pre-existing components, internal
  frameworks and general know-how, and we may reuse those in other work.</p>

  <h2>Third-party services</h2>
  <p>Our solutions and this website rely on third-party platforms including hosting, database,
  analytics, email and software libraries. Your use of those platforms may be subject to their own
  terms and pricing. We are not responsible for third-party services we do not control, and we make
  no warranty about their availability, pricing or continued operation.</p>

  <h2>Confidentiality</h2>
  <p>Information you share with us about your business is treated as confidential and used only to
  deliver the engagement or respond to your enquiry. Where a project requires it, we will sign a
  mutual non-disclosure agreement.</p>

  <h2>Partner Network</h2>
  <p>Participation in the Partner Network is subject to the partner agreement presented in the
  portal, which you must accept before your account is activated. Referral attribution, commission
  rates, rank conditions, qualification thresholds and payment timing are governed by that
  agreement and by the records shown in your portal. Commission is earned on amounts actually
  received by RRRTX for an attributed engagement, and is not payable on cancelled or refunded work.
  Certificates and letters issued through the portal record participation and standing; they are
  not a warranty of any partner's work, and verification confirms only that the document was issued
  by us and has not been revoked.</p>

  <h2>Availability and disclaimers</h2>
  <p>We aim to keep this website available and accurate, but it is provided on an "as is" and "as
  available" basis. We do not warrant that it will be uninterrupted, error-free, or free of harmful
  components, or that any content is complete or current at the moment you read it. Free tools and
  published material are provided without warranties of any kind, to the fullest extent permitted
  by law. Nothing in these terms excludes liability that cannot lawfully be excluded.</p>

  <h2>Limitation of liability</h2>
  <p>To the fullest extent permitted by law, RRRTX SYSTEMS is not liable for indirect, incidental
  or consequential loss, loss of profit, revenue, data or business opportunity arising from your use
  of this website, the free tools, the downloadable resources or the Partner Network portal. Where
  liability relates to a paid engagement, our total liability is limited as set out in the
  applicable project agreement. Nothing here limits liability for fraud, wilful misconduct, or any
  other liability that law does not permit us to limit.</p>

  <h2>Suspension and termination</h2>
  <p>We may suspend or terminate access to the website, the Partner Network portal or any account
  where these terms or a partner agreement are breached, where we are required to do so by law, or
  where continued access would expose us or others to risk. Termination of portal access does not
  remove obligations already accrued, including valid commission records.</p>

  <h2>Governing law and disputes</h2>
  <p>These website terms are intended to be governed by the laws applicable at RRRTX SYSTEMS'
  principal place of business. We have not stated a specific jurisdiction or venue here because
  that information should be confirmed with us directly, and because a project agreement may specify
  its own governing law that takes precedence for that engagement. If you have a dispute, please
  contact us first at the address below so that we can attempt to resolve it directly.</p>

  <h2>Changes to these terms</h2>
  <p>We may update these terms as the website and our services change. The date at the top of this
  page shows when it last changed. Continued use of the website after an update means you accept
  the revised terms.</p>

  ${contactBlock}
`;

export const COOKIES_CONTENT = `
  <p><strong>Last updated: ${LEGAL_LAST_UPDATED}</strong></p>

  <p>This policy explains the cookies and similar technologies used on rrrtx-systems.com. It lists
  what is actually set by the site as it is built, not a generic template.</p>

  <h2>Cookies we set</h2>

  <h3>Strictly necessary</h3>
  <p>These are required to operate parts of the site you have asked to use. They cannot be switched
  off without breaking the feature, and they are never used for advertising.</p>
  <ul>
    <li><strong>rrrtx_session</strong> — set only after an administrator signs in. It holds a signed,
    expiring identifier that keeps the dashboard session valid. It is HTTP-only, sent only over
    HTTPS, restricted to this site, and expires after 12 hours.</li>
    <li><strong>rrrtx_partner_session</strong> — set only after a partner signs in. Same properties
    and expiry as above, kept separate so an administrator and a partner session can coexist in one
    browser.</li>
    <li><strong>rrrtx_cookie_consent</strong> — set when you make a choice in the cookie banner. It
    records your decision so we do not ask again. It contains no identifier for you.</li>
  </ul>

  <h3>Analytics — only with your consent</h3>
  <p>If you accept analytics, we load Google Analytics 4, which helps us understand which pages are
  used and how visitors reach them. Google Analytics sets cookies including <strong>_ga</strong> and
  <strong>_ga_*</strong>, typically with a lifetime of up to two years, and processes information
  about your device, approximate location derived from your IP address, and your interactions with
  the site. This data is sent to Google.</p>
  <p>Analytics cookies are <strong>not</strong> set before you accept. If you decline, the Google
  Analytics script is never loaded. You can change your choice at any time using the
  "Cookie settings" link in the footer of every page.</p>

  <h3>What we do not use</h3>
  <ul>
    <li>No advertising, retargeting or marketing cookies.</li>
    <li>No social media tracking pixels or embedded social widgets.</li>
    <li>No third-party embedded videos, maps or comment systems.</li>
    <li>No fingerprinting or device-fingerprint-based identification.</li>
    <li>No data selling, and no sharing of personal information with data brokers.</li>
  </ul>

  <h3>Cookieless measurement</h3>
  <p>Vercel Web Analytics reports aggregate page views and Core Web Vitals. It does not set cookies
  and does not attempt to identify individual visitors. It is non-essential, so it is loaded only
  after you accept analytics — declining means it never loads.</p>

  <h3>Storage on your device</h3>
  <p>The interactive checklists and worksheets you can download from the Resource Library are
  standalone pages served from this domain. The conversion checklist saves your tick-box progress
  in your browser's local storage under the key <strong>rrrtx-cro-checklist-v1</strong>, so your
  progress survives a page refresh. That entry contains only which items you have ticked: no
  personal information, no identifier, and it is never transmitted to us or to anyone else. Clearing
  your browser data removes it.</p>
  <p>Apart from that checklist, and the consent cookie described above, the site does not use
  localStorage, sessionStorage or similar persistent storage to track you.</p>

  <h2>Managing your choice</h2>
  <p>Use the "Cookie settings" link in the footer to review or withdraw your choice at any time.
  Withdrawing consent stops both Google Analytics and Vercel Web Analytics from loading on subsequent visits. You can also delete
  or block cookies in your browser settings; blocking the strictly necessary cookies will prevent
  the dashboard and partner portal from working, but the public website will continue to function.</p>

  <h2>Why we ask at all</h2>
  <p>Google Analytics is non-essential and involves cookies, so we ask for your consent before it
  runs. This reflects the approach taken under EU and UK rules, and under India's Digital Personal
  Data Protection Act, which requires clear notice and consent for processing personal data unless
  a limited exception applies. Our
  <a href="/privacy">Privacy Policy</a> describes our wider data practices.</p>

  ${contactBlock}
`;

export const REFUNDS_CONTENT = `
  <p><strong>Last updated: ${LEGAL_LAST_UPDATED}</strong></p>

  <p>This policy explains how payments, cancellations and refunds work for RRRTX SYSTEMS
  engagements. It is a summary for clarity. Where a signed proposal, statement of work or partner
  agreement sets different terms, that document governs.</p>

  <h2>Our commercial model</h2>
  <p>We sell custom engineering work — ecommerce platforms, automation and AI systems,
  lead-generation infrastructure, rebuilds and related services — scoped individually for each
  client. Projects are typically billed as a deposit followed by milestone payments, with the
  schedule stated in the proposal you receive before any work starts.</p>

  <h2>Deposits</h2>
  <p>A deposit reserves capacity on our delivery schedule and covers the initial discovery,
  architecture and setup work that begins immediately. Because that work is performed specifically
  for you and consumes reserved capacity that cannot be resold, <strong>deposits are
  non-refundable once work has commenced</strong>. If you cancel before we begin any work, contact
  us and we will review the position on your specific project.</p>

  <h2>Cancelling a project</h2>
  <p>You may cancel an engagement in writing at any time. If you do, the following applies:</p>
  <ul>
    <li>Work completed and accepted up to the date of cancellation remains payable.</li>
    <li>Milestones already reached are invoiced and payable in the normal way.</li>
    <li>Work in progress that has not reached a milestone is assessed at our standard hourly rate
    for the time actually spent.</li>
    <li>Any amount you have paid beyond the value of work performed, plus any unconsumed deposit
    where no work has begun, is refunded to you.</li>
    <li>Where work has been delivered but not yet accepted, we will hand over what has been
    produced and agree a fair valuation.</li>
  </ul>

  <h2>Third-party costs</h2>
  <p>Projects frequently require third-party services — hosting, database, domain registration,
  software licences, paid media, API or model usage. Amounts already committed or paid to those
  providers are <strong>non-refundable by us</strong>, because they are outside our control and are
  usually governed by the provider's own refund rules. You retain ownership of any accounts and
  subscriptions purchased in your name.</p>

  <h2>Refunds</h2>
  <p>Where a refund is due under this policy, we process it to the original payment method within
  14 days of agreeing the final amount. We do not charge a cancellation fee of our own beyond the
  valuation of work already performed.</p>
  <p>We do not offer refunds for:</p>
  <ul>
    <li>Completed and accepted deliverables.</li>
    <li>Deposits on projects where work has commenced.</li>
    <li>Third-party costs already committed on your behalf.</li>
    <li>Free tools, audits or downloadable resources, which are provided at no charge.</li>
    <li>Changes of mind about business strategy after a system has been delivered and accepted.</li>
  </ul>
  <p>If you believe a deliverable does not match the agreed scope, tell us in writing within 14
  days of delivery. We will review it against the agreed specification and, where the work does not
  conform, correct it at no additional cost. This is our primary remedy for scope disputes, and it
  is offered in addition to any rights you have under applicable consumer law.</p>

  <h2>Late and disputed payments</h2>
  <p>Where the proposal includes payment schedules or late-payment terms, those apply. If a payment
  is disputed, contact us before the due date so we can resolve it; we will not suspend agreed work
  over a genuinely disputed invoice while we are working through it in good faith.</p>

  <h2>Retainers and ongoing services</h2>
  <p>Where we provide ongoing support, maintenance or retainer work, either party may end the
  arrangement with the notice period stated in the agreement. Fees already paid for a period
  already served are not refundable. Fees paid in advance for a period not yet served are refunded
  on a pro-rata basis less any third-party costs already committed.</p>

  <h2>Statutory rights</h2>
  <p>Nothing in this policy limits any non-waivable right you may have under the consumer law of
  your jurisdiction. Where those rights give you more than this policy provides, they apply.</p>

  ${contactBlock}
`;
