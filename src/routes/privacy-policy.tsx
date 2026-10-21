import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Eye,
  Share2,
  Lock,
  Cookie,
  UserCheck,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — VercelLoans" },
      {
        name: "description",
        content:
          "Read the VercelLoans privacy policy. Learn how we collect, use, and protect your personal information as a loan marketplace connecting borrowers with lending partners.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

const LAST_UPDATED = "October 22, 2026";

const sections = [
  { id: "who-we-are", label: "Who We Are", icon: ShieldCheck },
  { id: "information-we-collect", label: "Information We Collect", icon: Eye },
  { id: "how-we-use", label: "How We Use Your Data", icon: FileText },
  { id: "data-sharing", label: "Data Sharing & Disclosure", icon: Share2 },
  { id: "your-consent", label: "Your Consent", icon: UserCheck },
  { id: "data-security", label: "Data Security", icon: Lock },
  { id: "data-retention", label: "Data Retention", icon: Clock },
  { id: "your-rights", label: "Your Privacy Rights", icon: UserCheck },
  { id: "cookies", label: "Cookies & Tracking", icon: Cookie },
  { id: "third-party-links", label: "Third-Party Links", icon: ExternalLink },
  { id: "changes", label: "Policy Changes", icon: FileText },
  { id: "contact", label: "Contact Us", icon: Mail },
] as const;

function PrivacyPolicyPage() {
  return (
    <>
      {/* HERO BANNER */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{ background: "var(--gradient-subtle)" }}
        />
        <div className="container mx-auto px-4 pt-16 pb-12 lg:pt-24 lg:pb-16 text-center">
          <div
            className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl"
            style={{ background: "var(--gradient-hero)" }}
          >
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy matters to us. This policy explains how VercelLoans
            collects, uses, and safeguards your personal information as a loan
            marketplace.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* IMPORTANT DISCLOSURE BANNER */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="rounded-2xl border border-border bg-secondary/60 p-6 md:p-8 flex gap-4 items-start">
            <div
              className="hidden sm:grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{ background: "var(--gradient-hero)" }}
            >
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Important Disclosure</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                <strong>VercelLoans is not a bank, credit union, or direct lender.</strong>{" "}
                We operate as a digital loan marketplace that connects
                prospective borrowers with a network of vetted, licensed
                third-party lending partners (banks and financial institutions).
                We do not make credit decisions, approve or deny loan
                applications, or set interest rates. All lending decisions are
                made solely by our Lending Partners under their own terms and
                policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10">
          {/* SIDEBAR NAV */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                On this page
              </h3>
              <ul className="space-y-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <s.icon className="h-4 w-4 shrink-0" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* POLICY CONTENT */}
          <div className="max-w-3xl">
            {/* 1. WHO WE ARE */}
            <PolicySection id="who-we-are" number="01" title="Who We Are">
              <p>
                VercelLoans ("we," "our," or "us") operates a digital loan
                marketplace platform accessible at{" "}
                <strong>vercelloans.com</strong> (the "Platform"). We are{" "}
                <strong>not a bank, lender, or financial institution</strong>.
                Instead, we act as an intermediary that connects prospective
                borrowers ("you" or "users") with licensed third-party banks,
                financial institutions, and direct lenders ("Lending Partners").
              </p>
              <p>
                Our role is to help you find the best loan offers by collecting
                your information, analyzing your financial profile, and matching
                you with Lending Partners whose criteria align with your needs.
                All credit decisions, loan approvals, interest rates, and loan
                terms are determined solely by the respective Lending Partner.
              </p>
            </PolicySection>

            {/* 2. INFORMATION WE COLLECT */}
            <PolicySection
              id="information-we-collect"
              number="02"
              title="Information We Collect"
            >
              <p>
                To match you with the right Lending Partner, we collect various
                categories of personal and financial information:
              </p>

              <InfoCard title="Identity & Profile Data">
                Full legal name, date of birth, Social Security Number (SSN) or
                last four digits, and government-issued identification details.
              </InfoCard>

              <InfoCard title="Contact Data">
                Residential address, email address, and telephone/mobile number.
              </InfoCard>

              <InfoCard title="Financial & Employment Data">
                Employment status, employer name, monthly/annual income, bank
                account information, existing debt obligations, desired loan
                amount, and loan purpose.
              </InfoCard>

              <InfoCard title="Credit Information">
                With your explicit consent, credit scores and credit history
                obtained via authorized consumer reporting agencies. Initial
                checks use a soft pull that does not impact your credit score.
              </InfoCard>

              <InfoCard title="Technical & Usage Data">
                IP address, browser type, device identifiers, operating system,
                pages visited, referral URLs, and interaction data collected
                through cookies and similar tracking technologies.
              </InfoCard>
            </PolicySection>

            {/* 3. HOW WE USE YOUR DATA */}
            <PolicySection
              id="how-we-use"
              number="03"
              title="How We Use Your Information"
            >
              <ul className="space-y-3">
                {[
                  {
                    t: "Matching & Pre-Qualification",
                    d: "Analyze your financial profile and match you with Lending Partners whose criteria align with your application.",
                  },
                  {
                    t: "Facilitating Loan Applications",
                    d: "Securely transmit your application package to Lending Partners so they can evaluate, underwrite, and present loan offers.",
                  },
                  {
                    t: "Identity Verification & Fraud Prevention",
                    d: "Verify your identity, conduct Know-Your-Customer (KYC) checks, and prevent fraudulent activity on the Platform.",
                  },
                  {
                    t: "Communications",
                    d: "Contact you regarding your loan status, send platform updates, and respond to your inquiries or support requests.",
                  },
                  {
                    t: "Analytics & Improvement",
                    d: "Improve our matching algorithms, user interface, and overall marketplace performance through aggregated, anonymized analytics.",
                  },
                  {
                    t: "Legal Compliance",
                    d: "Comply with applicable federal and state laws, regulations, and legal processes.",
                  },
                ].map((item) => (
                  <li
                    key={item.t}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <strong className="text-sm">{item.t}</strong>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.d}
                    </p>
                  </li>
                ))}
              </ul>
            </PolicySection>

            {/* 4. DATA SHARING */}
            <PolicySection
              id="data-sharing"
              number="04"
              title="Data Sharing & Disclosure"
            >
              <div className="rounded-xl border border-border bg-secondary/40 p-5 mb-6">
                <p className="text-sm font-medium">
                  ⚠️ Because we operate as a connection platform — not a direct
                  lender — sharing data with third parties is core to the
                  service we provide.
                </p>
              </div>

              <p>We may share your personal and financial information with:</p>

              <h4 className="font-semibold mt-6 mb-2">Lending Partners</h4>
              <p>
                When you submit a loan inquiry or request offers, we share your
                data with our network of vetted banks and financial institutions
                to find matching loan products.{" "}
                <strong>
                  Once your data is shared with a Lending Partner, they process
                  it as an independent data controller under their own privacy
                  policy.
                </strong>{" "}
                We encourage you to review the privacy policy of any Lending
                Partner you choose to work with.
              </p>

              <h4 className="font-semibold mt-6 mb-2">
                Credit Bureaus & Consumer Reporting Agencies
              </h4>
              <p>
                To perform soft credit pulls for pre-qualification purposes, we
                may share limited personal identifiers with consumer reporting
                agencies such as Equifax, Experian, and TransUnion.
              </p>

              <h4 className="font-semibold mt-6 mb-2">
                Service Providers & Vendors
              </h4>
              <p>
                Third-party vendors who assist us with cloud hosting, identity
                verification, SMS/email communications, fraud detection, payment
                processing, and data analytics. These providers are
                contractually bound to protect your data and use it only for the
                services they provide to us.
              </p>

              <h4 className="font-semibold mt-6 mb-2">
                Legal & Regulatory Authorities
              </h4>
              <p>
                Law enforcement agencies, courts, or regulatory bodies when
                required by law, subpoena, or to protect our legal rights and
                the safety of our users.
              </p>

              <h4 className="font-semibold mt-6 mb-2">
                Business Transfers
              </h4>
              <p>
                In the event of a merger, acquisition, or sale of all or a
                portion of our assets, your personal information may be
                transferred to the acquiring entity.
              </p>

              <div className="rounded-xl border border-border bg-card p-5 mt-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">We do not sell your personal information</strong>{" "}
                  to third-party marketers or advertisers for their own
                  independent marketing purposes.
                </p>
              </div>
            </PolicySection>

            {/* 5. YOUR CONSENT */}
            <PolicySection
              id="your-consent"
              number="05"
              title="Your Consent"
            >
              <p>
                By registering on our Platform, submitting a loan request, or
                using our financial tools (such as eligibility checkers or rate
                calculators), you{" "}
                <strong>explicitly consent</strong> to the collection, storage,
                processing, and sharing of your personal data with our Lending
                Partners as outlined in this Privacy Policy.
              </p>
              <p>
                You have the right to withdraw your consent at any time by
                contacting us at{" "}
                <a
                  href="mailto:privacy@vercelloans.com"
                  className="underline hover:text-foreground"
                >
                  privacy@vercelloans.com
                </a>
                . Please note that withdrawing consent may prevent us or our
                Lending Partners from processing or continuing your loan
                application.
              </p>
            </PolicySection>

            {/* 6. DATA SECURITY */}
            <PolicySection
              id="data-security"
              number="06"
              title="Data Security"
            >
              <p>
                We implement industry-standard administrative, technical, and
                physical security safeguards to protect your personal data,
                including:
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "256-bit SSL/TLS encryption for all data transmissions",
                  "AES-256 encryption for sensitive data at rest",
                  "Multi-factor authentication for internal system access",
                  "Regular security audits and penetration testing",
                  "Role-based access controls limiting employee data access",
                  "SOC 2 Type II certified hosting infrastructure",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Lock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                While we take extensive measures to protect your information, no
                method of electronic transmission or storage is 100% secure. We
                cannot guarantee absolute security but are committed to
                promptly notifying affected users in the event of a data breach.
              </p>
            </PolicySection>

            {/* 7. DATA RETENTION */}
            <PolicySection
              id="data-retention"
              number="07"
              title="Data Retention"
            >
              <p>
                We retain your personal data only for as long as necessary to
                fulfill the purposes outlined in this policy, comply with
                applicable federal and state legal obligations, resolve
                disputes, and enforce our agreements.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Active loan applications: retained for the duration of the application process plus 7 years.",
                  "Incomplete applications: archived or securely deleted after 24 months of inactivity.",
                  "Marketing communications data: retained until you opt out.",
                  "Technical/usage data: retained for up to 13 months for analytics purposes.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </PolicySection>

            {/* 8. YOUR RIGHTS */}
            <PolicySection
              id="your-rights"
              number="08"
              title="Your Privacy Rights"
            >
              <p>
                Depending on your state of residence, you may have the following
                rights under applicable privacy laws (including the California
                Consumer Privacy Act — CCPA, the Virginia Consumer Data
                Protection Act — VCDPA, and other state privacy frameworks):
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {[
                  {
                    t: "Right to Know",
                    d: "Request disclosure of the categories and specific pieces of personal data we have collected about you.",
                  },
                  {
                    t: "Right to Access",
                    d: "Request a copy of the personal data we hold about you in a portable, readily usable format.",
                  },
                  {
                    t: "Right to Correction",
                    d: "Request corrections to any inaccurate or incomplete personal data we maintain.",
                  },
                  {
                    t: "Right to Deletion",
                    d: "Request the erasure of your personal data, subject to certain legal exceptions and retention requirements.",
                  },
                  {
                    t: "Right to Opt-Out",
                    d: "Opt out of the sale or sharing of your personal information for cross-context behavioral advertising.",
                  },
                  {
                    t: "Right to Non-Discrimination",
                    d: "Exercise your privacy rights without receiving discriminatory treatment from us.",
                  },
                ].map((right) => (
                  <div
                    key={right.t}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <strong className="text-sm">{right.t}</strong>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {right.d}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@vercelloans.com"
                  className="underline hover:text-foreground"
                >
                  privacy@vercelloans.com
                </a>{" "}
                or call{" "}
                <a
                  href="tel:1-800-555-0142"
                  className="underline hover:text-foreground"
                >
                  1-800-555-0142
                </a>
                . We will respond to verifiable requests within 45 days as
                required by applicable law.
              </p>
            </PolicySection>

            {/* 9. COOKIES */}
            <PolicySection
              id="cookies"
              number="09"
              title="Cookies & Tracking Technologies"
            >
              <p>
                We use cookies and similar tracking technologies to improve your
                experience on our Platform:
              </p>

              <div className="mt-4 space-y-3">
                {[
                  {
                    t: "Essential Cookies",
                    d: "Required for the Platform to function properly (e.g., session management, security tokens). These cannot be disabled.",
                  },
                  {
                    t: "Analytics Cookies",
                    d: "Help us understand how users interact with the Platform so we can improve performance and user experience.",
                  },
                  {
                    t: "Functional Cookies",
                    d: "Remember your preferences (e.g., pre-filled form fields, language settings) to enhance your experience.",
                  },
                  {
                    t: "Marketing Cookies",
                    d: "Used to deliver relevant advertisements and measure campaign effectiveness. You may opt out of these at any time.",
                  },
                ].map((cookie) => (
                  <div
                    key={cookie.t}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <strong className="text-sm">{cookie.t}</strong>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cookie.d}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                You can manage your cookie preferences through your browser
                settings. Disabling certain cookies may limit your ability to
                use some features of the Platform.
              </p>
            </PolicySection>

            {/* 10. THIRD-PARTY LINKS */}
            <PolicySection
              id="third-party-links"
              number="10"
              title="Third-Party Links"
            >
              <p>
                Our Platform may contain links to external websites, partner
                lender portals, and third-party services. We are{" "}
                <strong>not responsible</strong> for the privacy practices,
                content, or security of those third-party sites. We encourage
                you to review the privacy policy of any Lending Partner or
                external site you choose to visit or engage with.
              </p>
            </PolicySection>

            {/* 11. CHANGES */}
            <PolicySection
              id="changes"
              number="11"
              title="Changes to This Privacy Policy"
            >
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in legal requirements, our business practices, or the
                features we offer. When we make material changes, we will:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Post the updated policy on this page with a revised "Last
                  Updated" date.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Notify you via email or a prominent notice on the Platform if
                  the changes materially affect your rights.
                </li>
              </ul>
              <p className="mt-3">
                We encourage you to review this page periodically to stay
                informed about our data practices.
              </p>
            </PolicySection>

            {/* 12. CONTACT US */}
            <PolicySection id="contact" number="12" title="Contact Us">
              <p>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Company
                  </span>
                  <p className="mt-1 text-sm font-medium">
                    VercelLoans, Inc.
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Privacy Inquiries
                  </span>
                  <p className="mt-1 text-sm">
                    <a
                      href="mailto:privacy@vercelloans.com"
                      className="underline hover:text-foreground text-muted-foreground"
                    >
                      privacy@vercelloans.com
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    General Support
                  </span>
                  <p className="mt-1 text-sm">
                    <a
                      href="mailto:support@vercelloans.com"
                      className="underline hover:text-foreground text-muted-foreground"
                    >
                      support@vercelloans.com
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone
                  </span>
                  <p className="mt-1 text-sm">
                    <a
                      href="tel:1-800-555-0142"
                      className="underline hover:text-foreground text-muted-foreground"
                    >
                      1-800-555-0142
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Postal Address
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    VercelLoans, Inc.
                    <br />
                    1209 Orange Street
                    <br />
                    Wilmington, DE 19801, USA
                  </p>
                </div>
              </div>
            </PolicySection>

            {/* BACK TO HOME */}
            <div className="mt-16 pt-8 border-t border-border text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-hero)" }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Reusable sub-components ─── */

function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-28">
      <div className="flex items-baseline gap-4 mb-5">
        <span
          className="text-3xl font-bold"
          style={{
            background: "var(--gradient-hero)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {number}
        </span>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 mt-3">
      <strong className="text-sm text-foreground">{title}</strong>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
