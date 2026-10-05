import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export function TermsAndConditionsModal({
  isOpen,
  onClose,
  onAccept,
}: TermsAndConditionsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-gray-200 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h2 className="text-xl font-bold text-[#002366]">
              PRIVACY, DATA USE, CONSENT AND PLATFORM TERMS
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
              <span>
                <strong>Platform:</strong> checkcrisp.com
              </span>
              <span>
                <strong>Operator:</strong> Alpharubix Infotech Solutions Pvt Ltd
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-0.5">
              <span>Effective Date: 01st Jan 2026</span>
              <span>Last Updated: 31st Dec 2030</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors self-start"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              1. INTRODUCTION AND ACCEPTANCE
            </h3>
            <p>
              <strong>1.1</strong> These Privacy, Data Use, Consent and Platform
              Terms (“Policy”) govern the collection, access, receipt, storage,
              processing, analysis, verification, use, transmission, disclosure and
              other handling of information submitted, uploaded, generated,
              retrieved or otherwise made available by a person accessing or using
              checkcrisp.com (“Platform”).
            </p>
            <p>
              <strong>1.2</strong> The Platform is owned, managed and operated by
              Alpharubix Infotech Solutions Private Limited, a company
              incorporated under the Companies Act, 2013 (“Alpharubix”,
              “Company”, “we”, “us” or “our”).
            </p>
            <p>
              <strong>1.3</strong> “Customer”, “User”, “you” or “your” means any
              individual, proprietor, partner, director, authorised
              representative, entity, applicant, borrower, prospective borrower
              or other person accessing or using the Platform.
            </p>
            <p>
              <strong>1.4</strong> By registering, creating an account, logging
              into the Platform, uploading information, connecting a data
              source, requesting a report or service, or clicking “I Agree /
              Accept &amp; Continue / Give Consent”, the User acknowledges that
              the User has read and understood this Policy and agrees to the
              applicable Platform Terms.
            </p>
            <p>
              <strong>1.5</strong> Where processing of personal data requires
              consent under applicable law, such consent shall be obtained
              separately and specifically for the stated purposes. Where separate
              consent is required for accessing credit information, bank
              information or other regulated information, the User shall be
              required to provide such consent before the relevant service is
              activated.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              2. PURPOSE OF THE PLATFORM
            </h3>
            <p>
              <strong>2.1</strong> checkcrisp.com is a technology platform
              intended to facilitate, among other things:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) customer onboarding and verification;</li>
              <li>
                (b) collection and organisation of financial and business
                information;
              </li>
              <li>
                (c) analysis of financial, banking, tax, credit and business
                information;
              </li>
              <li>
                (d) generation of analytical reports, financial profiles,
                eligibility assessments, risk indicators and other insights;
              </li>
              <li>(e) credit assessment and pre-underwriting support;</li>
              <li>(f) fraud, identity and document verification;</li>
              <li>
                (g) assessment of financial capacity, business performance and
                creditworthiness;
              </li>
              <li>
                (h) facilitation of applications for financial products and
                services;
              </li>
              <li>
                (i) matching or connecting Customers with banks, NBFCs, financial
                institutions, credit providers and other service providers;
              </li>
              <li>
                (j) monitoring, servicing and managing applications or
                transactions initiated through the Platform;
              </li>
              <li>
                (k) compliance, audit, fraud prevention and risk-management
                activities; and
              </li>
              <li>
                (l) development, maintenance and improvement of the Platform and
                its analytical capabilities.
              </li>
            </ul>
            <p>
              <strong>2.2</strong> Unless expressly stated otherwise, Alpharubix
              does not represent merely by operating the Platform that it is
              itself a bank, NBFC, Credit Information Company or other regulated
              lender.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              3. INFORMATION THAT MAY BE COLLECTED
            </h3>
            <p>
              Depending upon the services selected by the User, the Company may
              collect or process information including:
            </p>
            <div className="space-y-2 pl-2">
              <p>
                <strong>3.1 Identity and KYC Information:</strong> Name, date of
                birth, photograph, gender where applicable, address, mobile
                number, email address, PAN, Aadhaar-related information where
                lawfully permitted, passport, voter ID, driving licence and other
                identity or KYC information.
              </p>
              <p>
                <strong>3.2 Business Information:</strong> Business name,
                constitution, registered address, incorporation details, CIN,
                LLPIN, GSTIN, UDYAM details, industry, business activity,
                ownership structure, directors, partners, promoters,
                shareholders, customers, suppliers and related information.
              </p>
              <p>
                <strong>3.3 GST Information:</strong> GST registrations, returns,
                sales information, purchase information, invoices, tax filings,
                turnover, e-way bill-related information where lawfully
                available, filing history and associated GST information.
              </p>
              <p>
                <strong>3.4 Income-Tax Information:</strong> Income-tax returns,
                computation of income, financial statements, tax audit
                information, Form 26AS, AIS/TIS and related information where
                supplied or lawfully accessed.
              </p>
              <p>
                <strong>3.5 Banking and Financial Information:</strong> Bank
                statements, transaction records, account details, balances,
                credits, debits, banking turnover, cash-flow information,
                existing loan obligations, repayment information and other
                financial data.
              </p>
              <p>
                <strong>3.6 Credit Information:</strong> Subject to applicable law
                and valid authorisation, information contained in credit reports,
                credit scores, credit enquiries, existing credit facilities,
                repayment history, defaults, overdue amounts and other
                information made available by authorised Credit Information
                Companies or permitted intermediaries.
              </p>
              <p>
                <strong>3.7 Documents:</strong> Financial statements, balance
                sheets, profit and loss accounts, cash-flow statements, invoices,
                purchase orders, contracts, sanction letters, loan statements,
                ownership documents and other documents voluntarily uploaded or
                provided.
              </p>
              <p>
                <strong>3.8 Technical Information:</strong> IP address, browser
                type, device information, operating system, login timestamps,
                session information, cookies, device identifiers, security logs,
                audit trails and usage information.
              </p>
              <p>
                <strong>3.9 Derived and Analytical Information:</strong> The
                Company may generate information derived from information
                supplied or lawfully obtained, including financial ratios, risk
                indicators, eligibility indicators, behavioural patterns,
                transaction classifications, fraud indicators, cash-flow
                analysis, business trends and other analytical outputs.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              4. PURPOSES FOR WHICH INFORMATION MAY BE PROCESSED
            </h3>
            <p>
              Subject to applicable law, information may be processed for one or
              more specified purposes disclosed to the User, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) establishing and administering the User&apos;s account;</li>
              <li>(b) authenticating identity;</li>
              <li>(c) performing KYC, KYB and verification;</li>
              <li>
                (d) analysing GST, tax, banking and financial information;
              </li>
              <li>(e) generating financial and business analytics;</li>
              <li>(f) assessing credit eligibility and financial capacity;</li>
              <li>(g) facilitating pre-underwriting or credit assessment;</li>
              <li>
                (h) facilitating applications to lenders or financial-service
                providers;
              </li>
              <li>
                (i) communicating with banks, NBFCs, financial institutions,
                service providers and other counterparties where authorised and
                necessary for the relevant service;
              </li>
              <li>
                (j) detecting fraud, impersonation, manipulation, suspicious
                activity and misuse;
              </li>
              <li>(k) improving risk-management systems;</li>
              <li>
                (l) providing reports, dashboards, recommendations and analytical
                outputs requested by the User;
              </li>
              <li>(m) servicing transactions or applications;</li>
              <li>
                (n) complying with legal, regulatory, judicial and governmental
                requirements;
              </li>
              <li>(o) maintaining records and audit trails;</li>
              <li>(p) investigating disputes, complaints or security incidents;</li>
              <li>(q) enforcing contractual rights;</li>
              <li>
                (r) protecting the Platform, Company, Customers and third parties
                against unlawful activity;
              </li>
              <li>
                (s) developing and improving products, algorithms, models and
                Platform functionality, using personal data only to the extent
                permitted by applicable law and the relevant notice/consent;
              </li>
              <li>(t) generating statistical or aggregated information;</li>
              <li>
                (u) conducting internal analytics, quality control and
                performance monitoring; and
              </li>
              <li>
                (v) any other compatible or separately disclosed lawful purpose
                for which appropriate consent or other lawful basis exists.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              5. CUSTOMER AUTHORISATION
            </h3>
            <p>
              <strong>5.1</strong> Where consent is the applicable legal basis, the
              User authorises Alpharubix to process the categories of
              information selected or submitted by the User for the purposes
              expressly identified at the point of collection.
            </p>
            <p>
              <strong>5.2</strong> The User acknowledges that processing may
              involve automated systems, analytical tools, algorithms, APIs and
              authorised service providers.
            </p>
            <p>
              <strong>5.3</strong> Information may be combined with other
              information lawfully obtained about the User for the relevant
              disclosed purpose.
            </p>
            <p>
              <strong>5.4</strong> Alpharubix may generate derived information,
              analytical results and reports from the information processed
              through the Platform.
            </p>
            <p>
              <strong>5.5</strong> Nothing in this Policy shall be interpreted as
              authorising Alpharubix to process personal data for an unrelated
              purpose where applicable law requires fresh or separate consent.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              6. CREDIT BUREAU AUTHORISATION
            </h3>
            <p>
              Where the User elects to use a service involving credit
              information, a separate authorisation may be presented substantially
              as follows:
            </p>
            <blockquote className="border-l-4 border-[#002366] bg-gray-50 p-4 rounded-r-lg text-xs italic space-y-2">
              <p className="font-bold uppercase not-italic text-gray-900">
                Credit Information Authorisation
              </p>
              <p>
                “I expressly authorise Alpharubix Infotech Solutions Private
                Limited and/or the appropriately authorised bank, NBFC, financial
                institution, Credit Information Company, specified user, service
                provider or other permitted entity involved in providing the
                selected service to obtain, access, verify and process my credit
                information and/or credit report from such Credit Information
                Companies or other sources as may be lawfully permitted, solely
                for the purposes disclosed to me, including identity verification,
                credit assessment, eligibility assessment, pre-underwriting,
                fraud prevention, financial-product facilitation and servicing
                of my request.
              </p>
              <p>
                I understand that giving this consent does not guarantee
                approval, sanction or disbursement of any credit facility.”
              </p>
            </blockquote>
            <p>
              Any credit-information access shall remain subject to applicable
              law and the entitlement of the entity actually requesting the
              information.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              7. BANK STATEMENT AND FINANCIAL-DATA CONSENT
            </h3>
            <p>
              Where a Customer provides bank statements or permits lawful
              retrieval of financial information, the Customer authorises
              processing for the purposes identified in the applicable consent
              screen, which may include:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) cash-flow analysis;</li>
              <li>(b) income and turnover assessment;</li>
              <li>(c) identification of existing obligations;</li>
              <li>(d) financial-risk assessment;</li>
              <li>(e) transaction categorisation;</li>
              <li>(f) eligibility assessment;</li>
              <li>(g) fraud detection;</li>
              <li>(h) pre-underwriting; and</li>
              <li>(i) financial-product facilitation.</li>
            </ul>
            <p>
              Where information is accessed through an RBI-regulated Account
              Aggregator ecosystem, applicable consent artefacts and Account
              Aggregator requirements shall govern such access.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              8. GST AND TAX INFORMATION CONSENT
            </h3>
            <p>
              The User authorises Alpharubix, where permitted and for the
              purposes disclosed, to process GST, tax and related financial
              information supplied by the User or retrieved through a lawful
              mechanism authorised by the User.
            </p>
            <p>
              Such processing may include analysing turnover, filing behaviour,
              sales and purchase patterns, tax information, customer and supplier
              concentration, financial trends and other indicators relevant to the
              selected Platform service.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              9. DISCLOSURE TO THIRD PARTIES
            </h3>
            <p>
              Subject to applicable law, relevant notices and required consent,
              information may be disclosed to appropriate recipients where
              necessary for the service requested, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) banks;</li>
              <li>(b) NBFCs;</li>
              <li>(c) financial institutions;</li>
              <li>(d) regulated lenders;</li>
              <li>
                (e) Credit Information Companies and/or entities lawfully
                entitled to interact with them;
              </li>
              <li>(f) KYC and identity-verification providers;</li>
              <li>(g) fraud-prevention and risk-management providers;</li>
              <li>
                (h) technology, cloud, hosting and cybersecurity providers;
              </li>
              <li>
                (i) accountants, auditors, consultants, advocates and
                professional advisers;
              </li>
              <li>(j) collection or servicing agencies where lawfully relevant;</li>
              <li>
                (k) governmental, regulatory, judicial, statutory or
                law-enforcement authorities where legally required; and
              </li>
              <li>
                (l) successors or counterparties in a lawful corporate
                restructuring, merger, acquisition or transfer of business,
                subject to applicable legal requirements.
              </li>
            </ul>
            <p>
              Alpharubix shall not treat acceptance of this Policy as unlimited
              permission to sell or disclose personal information to unrelated
              third parties for purposes unrelated to those disclosed to the User.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              10. SERVICE PROVIDERS AND DATA PROCESSORS
            </h3>
            <p>
              Alpharubix may appoint third-party processors and technology
              providers to perform functions on its behalf. Such functions may
              include hosting, storage, analytics, verification,
              communications, cybersecurity, document processing, customer
              support and Platform infrastructure.
            </p>
            <p>
              Where required by applicable law, such processors shall process
              personal data pursuant to appropriate contractual arrangements.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              11. DATA ANALYTICS AND PLATFORM DEVELOPMENT
            </h3>
            <p>
              <strong>11.1</strong> Alpharubix may create statistical,
              analytical, aggregated or anonymised information from data processed
              through the Platform, subject to applicable law.
            </p>
            <p>
              <strong>11.2</strong> Information that is genuinely anonymised so
              that it no longer constitutes personal data may be used for
              statistical analysis, benchmarking, product development, risk-model
              development, market research, fraud-pattern analysis, Platform
              optimisation, and commercial analytics.
            </p>
            <p>
              <strong>11.3</strong> Where identifiable personal data is proposed
              to be used for developing or improving analytical models beyond the
              original service purpose, Alpharubix shall ensure that such
              processing is permitted under applicable law and supported by an
              appropriate notice, consent or other lawful basis.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              12. AUTOMATED ANALYSIS
            </h3>
            <p>
              The Platform may use automated processes to analyse information and
              generate indicators, classifications, recommendations or reports.
              Automated output may be based upon information supplied by the
              User, third-party data and analytical methodologies.
            </p>
            <p>
              Such output is intended to assist assessment and decision-making
              and should not automatically be interpreted as a binding credit
              decision by a lender unless expressly communicated by the relevant
              lender.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              13. NO GUARANTEE OF CREDIT
            </h3>
            <p>Use of checkcrisp.com does not guarantee:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) approval of a loan;</li>
              <li>(b) sanction of a credit facility;</li>
              <li>(c) any particular interest rate;</li>
              <li>(d) any particular credit limit;</li>
              <li>(e) disbursement;</li>
              <li>(f) improvement in credit score;</li>
              <li>(g) acceptance by a bank or NBFC; or</li>
              <li>(h) any specific financial outcome.</li>
            </ul>
            <p>
              Every lender may independently apply its own underwriting, credit,
              risk and compliance policies.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              14. CUSTOMER RESPONSIBILITIES
            </h3>
            <p>The User represents and warrants that:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) information supplied is true, accurate, complete and current;</li>
              <li>
                (b) documents submitted are genuine and have not been
                manipulated;
              </li>
              <li>(c) the User has authority to provide the information;</li>
              <li>
                (d) where information relates to another individual, the User has
                all authority and permissions required by law;
              </li>
              <li>(e) the User will not impersonate another person;</li>
              <li>
                (f) the Platform will not be used for fraudulent or unlawful
                purposes; and
              </li>
              <li>(g) login credentials will be kept confidential.</li>
            </ul>
            <p>
              The User shall promptly notify Alpharubix of suspected
              unauthorised access to the User&apos;s account.
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              15. INFORMATION ACCURACY
            </h3>
            <p>
              Alpharubix may rely upon information supplied by the User or
              received from third-party sources. The Company does not warrant
              that information supplied by external sources is error-free,
              complete or continuously updated. Users should independently verify
              material financial or credit information before relying upon it for
              important decisions.
            </p>
          </section>

          {/* Section 16 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">16. SECURITY</h3>
            <p>
              Alpharubix shall maintain reasonable technical and organisational
              security safeguards appropriate to the nature of the personal data
              processed and applicable legal requirements. Such safeguards may
              include, as appropriate, access controls, authentication
              mechanisms, encryption, monitoring, logging, backups, vulnerability
              management and incident-response procedures.
            </p>
            <p>
              No electronic system can, however, be guaranteed to be completely
              immune from cyberattack, technical failure or unauthorised
              activity.
            </p>
          </section>

          {/* Section 17 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              17. DATA RETENTION
            </h3>
            <p>
              Personal data shall be retained for such period as is necessary for
              the disclosed purpose, fulfilment of contractual obligations,
              compliance with applicable law, regulatory requirements, audit
              requirements, fraud prevention, dispute management or establishment,
              exercise or defence of legal claims.
            </p>
            <p>
              Where applicable law requires deletion following withdrawal of
              consent or completion of the specified purpose, Alpharubix shall
              take appropriate action subject to legally permitted retention.
            </p>
          </section>

          {/* Section 18 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              18. WITHDRAWAL OF CONSENT
            </h3>
            <p>
              Where processing is based on consent, the User may withdraw consent
              through the mechanism provided by Alpharubix. Withdrawal shall
              apply prospectively and shall not ordinarily invalidate processing
              lawfully undertaken before withdrawal.
            </p>
            <p>
              Withdrawal may prevent Alpharubix from continuing to provide a
              service that necessarily depends upon the relevant information.
              Information may nevertheless be retained or processed where
              required or permitted by applicable law.
            </p>
          </section>

          {/* Section 19 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">19. USER RIGHTS</h3>
            <p>
              Subject to applicable law and its commencement, Users may have
              rights concerning their personal data, including rights relating
              to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) access to information about processing;</li>
              <li>(b) correction of inaccurate or misleading personal data;</li>
              <li>(c) completion of incomplete information;</li>
              <li>(d) updating personal information;</li>
              <li>(e) erasure where legally applicable;</li>
              <li>(f) withdrawal of consent;</li>
              <li>(g) grievance redressal; and</li>
              <li>
                (h) nomination or other rights provided under applicable
                data-protection legislation.
              </li>
            </ul>
          </section>

          {/* Section 20 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              20. CONFIDENTIALITY
            </h3>
            <p>
              Alpharubix shall treat confidential Customer information in
              accordance with applicable law and its contractual obligations.
              Confidentiality obligations shall not prevent disclosure where:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) authorised by the User;</li>
              <li>(b) necessary for providing the selected service;</li>
              <li>(c) required by law;</li>
              <li>(d) required by a court, regulator or governmental authority;</li>
              <li>
                (e) necessary for preventing or investigating fraud or unlawful
                activity; or
              </li>
              <li>(f) otherwise legally permitted.</li>
            </ul>
          </section>

          {/* Section 21 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              21. LIMITATION OF LIABILITY
            </h3>
            <p>
              To the maximum extent permitted by applicable law, Alpharubix shall
              not be liable for indirect, incidental, special, exemplary,
              punitive or consequential losses arising from use of the Platform,
              including loss of profit, business opportunity or anticipated
              financing.
            </p>
            <p>
              Alpharubix shall not be responsible for a lender&apos;s independent
              decision to approve, reject, modify or withdraw a financial
              facility. Alpharubix shall not be responsible for inaccuracies
              originating from information supplied by the User or independent
              third-party sources, except to the extent responsibility cannot
              lawfully be excluded.
            </p>
          </section>

          {/* Section 22 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              22. THIRD-PARTY SERVICES
            </h3>
            <p>
              The Platform may interact with services provided by third parties.
              Alpharubix does not control the independent processing practices of
              third parties acting as separate data fiduciaries/controllers. Users
              may therefore also be subject to the terms and privacy policies of
              those entities.
            </p>
          </section>

          {/* Section 23 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">23. INDEMNITY</h3>
            <p>
              To the extent permitted by law, the User agrees to indemnify and
              hold harmless Alpharubix, its directors, officers, employees and
              authorised representatives from claims, losses, costs or
              liabilities arising from:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) fraudulent information submitted by the User;</li>
              <li>
                (b) unauthorised submission of another person&apos;s information;
              </li>
              <li>(c) misuse of the Platform;</li>
              <li>(d) violation of applicable law by the User;</li>
              <li>
                (e) infringement of third-party rights by materials supplied by
                the User; or
              </li>
              <li>(f) material breach of these Platform Terms.</li>
            </ul>
          </section>

          {/* Section 24 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              24. INTELLECTUAL PROPERTY
            </h3>
            <p>
              All proprietary Platform software, analytical methodologies,
              interfaces, designs, workflows, databases, reports, trademarks and
              other intellectual property belonging to Alpharubix or its
              licensors shall remain their respective property. No ownership
              rights are transferred to the User merely through access to the
              Platform.
            </p>
          </section>

          {/* Section 25 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              25. COOKIES AND TECHNOLOGIES
            </h3>
            <p>
              The Platform may use cookies and similar technologies for
              authentication, security, preferences, analytics and Platform
              functionality. Where legally required, Users shall be provided
              appropriate choices regarding non-essential cookies or similar
              technologies.
            </p>
          </section>

          {/* Section 26 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              26. DATA BREACHES
            </h3>
            <p>
              Where a personal-data breach occurs, Alpharubix shall take
              reasonable steps to contain, investigate and remediate the incident
              and shall provide notifications to affected persons and/or competent
              authorities where required under applicable law.
            </p>
          </section>

          {/* Section 27 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">27. CHILDREN</h3>
            <p>
              The Platform is intended primarily for persons legally capable of
              entering into the relevant transaction or acting for a business.
              Users below eighteen years of age should not independently submit
              financial, credit or KYC information through the Platform unless
              such processing is specifically supported by the Platform and
              complies with applicable requirements relating to children.
            </p>
          </section>

          {/* Section 28 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              28. REGULATORY DISCLOSURE
            </h3>
            <p>
              Alpharubix is a technology/fintech service provider unless a
              particular service expressly states otherwise. Nothing displayed on
              checkcrisp.com should be interpreted as representing Alpharubix as a
              bank, NBFC, Credit Information Company or other RBI-regulated
              financial institution unless Alpharubix actually holds the
              applicable authorisation. Credit facilities, where offered by
              third-party lenders, remain subject to the lender&apos;s independent
              approval and documentation.
            </p>
          </section>

          {/* Section 29 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              29. MODIFICATION OF POLICY
            </h3>
            <p>
              Alpharubix may amend this Policy from time to time to reflect
              changes in the Platform, applicable law, regulatory requirements or
              business processes. Where an amendment materially changes the
              purpose for which personal data is processed or requires fresh
              consent under applicable law, appropriate notice and/or fresh
              consent shall be obtained.
            </p>
          </section>

          {/* Section 30 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              30. SUSPENSION AND TERMINATION
            </h3>
            <p>
              Alpharubix may restrict or suspend access to the Platform where
              reasonably necessary because of:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>(a) suspected fraud;</li>
              <li>(b) security concerns;</li>
              <li>(c) misuse;</li>
              <li>(d) breach of Platform Terms;</li>
              <li>(e) legal or regulatory requirements; or</li>
              <li>(f) threats to the Platform or other Users.</li>
            </ul>
            <p>
              Termination of an account shall not automatically require deletion of
              information that Alpharubix is legally entitled or required to
              retain.
            </p>
          </section>

          {/* Section 31 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              31. GOVERNING LAW AND JURISDICTION
            </h3>
            <p>
              This Policy and the use of checkcrisp.com shall be governed by the
              laws of India. Subject to any mandatory consumer, data-protection or
              other statutory jurisdiction, courts at Bengaluru, Karnataka shall
              have jurisdiction over disputes relating to these Platform Terms.
            </p>
          </section>

          {/* Section 32 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              32. GRIEVANCE REDRESSAL AND PRIVACY CONTACT
            </h3>
            <p>
              For privacy concerns, correction requests, withdrawal of consent,
              grievances or questions regarding personal-data processing, Users
              may contact:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs space-y-1 text-gray-800">
              <p className="font-bold text-sm text-[#002366]">
                Alpharubix Infotech Solutions Private Limited
              </p>
              <p>
                <strong>Platform:</strong> checkcrisp.com
              </p>
              <p>
                <strong>Grievance Officer / Data Protection Contact:</strong>{' '}
                Ashok Kumar
              </p>
              <p>
                <strong>Email:</strong> legal@alpharubixinfotech.com
              </p>
              <p>
                <strong>Address:</strong> Hosur Rd, Kudlu Gate, Srinivasa Nagar,
                Hal Layout, Singasandra, Bengaluru, Karnataka 560068
              </p>
              <p>
                <strong>Telephone:</strong> +91 93641 11642
              </p>
            </div>
            <p>
              The Company shall process grievances in accordance with applicable
              law.
            </p>
          </section>

          {/* Section 33 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              33. ELECTRONIC RECORD AND CONSENT LOG
            </h3>
            <p>
              The User acknowledges that acceptance through an electronic
              interface may be recorded together with relevant audit information
              including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>User/account identifier;</li>
              <li>mobile number or email;</li>
              <li>date and time;</li>
              <li>IP/device/session information;</li>
              <li>version of the notice and consent presented;</li>
              <li>purposes consented to;</li>
              <li>categories of information authorised;</li>
              <li>consent status; and</li>
              <li>withdrawal or modification of consent.</li>
            </ul>
            <p>
              Such records may be retained as evidence of authorisation,
              compliance and transaction history in accordance with applicable
              law.
            </p>
          </section>

          {/* Section 34 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              34. SEVERABILITY
            </h3>
            <p>
              If any provision of these Terms is held invalid or unenforceable,
              such provision shall be interpreted or restricted to the minimum
              extent necessary and the remaining provisions shall continue to
              operate.
            </p>
          </section>

          {/* Section 35 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-900 text-base">
              35. ENTIRE UNDERSTANDING
            </h3>
            <p>
              These Platform Terms, the Privacy Notice, applicable consent
              artefacts, specific product terms and any other terms expressly
              accepted by the User constitute the applicable understanding
              concerning use of the Platform and processing undertaken in
              connection with the relevant services.
            </p>
            <p>
              Where a specific consent or mandatory statutory requirement conflicts
              with a general provision of these Terms, the specific consent or
              mandatory legal requirement shall prevail.
            </p>
          </section>

          {/* Section 36 */}
          <section className="space-y-2 bg-blue-50/50 p-4 border border-blue-100 rounded-xl">
            <h3 className="font-bold text-[#002366] text-base">
              36. USER ACKNOWLEDGEMENT
            </h3>
            <p className="font-medium text-gray-800">
              By clicking “Accept &amp; Continue”, the User confirms that:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>
                the User has read and understood the Platform Terms and Privacy
                Notice;
              </li>
              <li>
                information supplied by the User is accurate to the best of the
                User&apos;s knowledge;
              </li>
              <li>
                the User understands the purposes for which information will be
                processed;
              </li>
              <li>
                the User understands that consent-based processing may be
                withdrawn in accordance with applicable law;
              </li>
              <li>
                use of the Platform does not guarantee a loan or financial
                facility; and
              </li>
              <li>
                separate explicit authorisation may be required before
                credit-bureau, bank or other regulated financial information is
                accessed.
              </li>
            </ol>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 hidden sm:block">
            Alpharubix Infotech Solutions Private Limited
          </p>
          <Button
            type="button"
            className="bg-[#002366] text-white hover:bg-[#001845] px-6 font-semibold"
            onClick={() => {
              onAccept?.();
              onClose();
            }}
          >
            I Agree &amp; Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditionsModal;
