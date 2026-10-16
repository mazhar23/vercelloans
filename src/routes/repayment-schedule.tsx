import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Building2, Info, DollarSign } from "lucide-react";

export const Route = createFileRoute("/repayment-schedule")({
  head: () => ({
    meta: [
      { title: "Loan Repayment Schedule — VercelLoans" },
      {
        name: "description",
        content:
          "View detailed loan repayment schedules for principal amounts from $3,000 to $4,500 with terms from 12 to 48 months at 10% APR.",
      },
    ],
  }),
  component: RepaymentSchedulePage,
});

/* ── helpers ──────────────────────────────────────────────────────────── */

const ANNUAL_RATE = 0.10;

const PRINCIPALS = [3000, 3500, 4000, 4500] as const;
const TERMS = [12, 14, 16, 18, 24, 28, 32, 36, 48] as const;

/**
 * Simple flat annual interest formula:
 *   Total Interest = Principal × Rate × (Term / 12)
 *   Total Repayment = Principal + Total Interest
 *   Monthly Installment = Total Repayment / Term
 */
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

/* ── page ─────────────────────────────────────────────────────────────── */

function RepaymentSchedulePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* ── header ──────────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto">
        <div
          className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl"
          style={{ background: "var(--gradient-hero)" }}
        >
          <DollarSign className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Loan Repayment Schedule
        </h1>
        <p className="mt-4 text-muted-foreground">
          Fixed monthly installments at{" "}
          <span className="font-semibold text-foreground">10% APR</span> for
          principal amounts ranging from{" "}
          <span className="font-semibold text-foreground">$3,000</span> to{" "}
          <span className="font-semibold text-foreground">$4,500</span>.
        </p>
      </div>

      {/* ── repayment table ────────────────────────────────────────── */}
      <div className="mt-12 max-w-5xl mx-auto rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="repayment-table">
            <thead>
              <tr className="bg-secondary">
                <th
                  className="sticky left-0 z-10 bg-secondary px-5 py-4 text-left font-semibold whitespace-nowrap"
                  rowSpan={2}
                >
                  Loan Term
                </th>
                <th
                  className="px-5 py-3 text-center font-semibold border-b border-border"
                  colSpan={PRINCIPALS.length}
                >
                  Monthly Installment by Principal Amount
                </th>
              </tr>
              <tr className="bg-secondary/70">
                {PRINCIPALS.map((p) => (
                  <th
                    key={p}
                    className="px-5 py-3 text-center font-semibold whitespace-nowrap"
                  >
                    {fmt(p)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TERMS.map((term, i) => {
                const isEven = i % 2 === 0;
                return (
                  <tr
                    key={term}
                    className={`border-t border-border transition-colors hover:bg-muted/50 ${
                      isEven ? "" : "bg-muted/20"
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-card px-5 py-4 font-medium whitespace-nowrap">
                      {term} months
                    </td>
                    {PRINCIPALS.map((principal) => (
                      <td
                        key={`${principal}-${term}`}
                        className="px-5 py-4 text-center tabular-nums"
                      >
                        {fmt(monthlyPayment(principal, term))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

          <div className="border-t border-border bg-muted/30 px-5 py-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              All amounts above are calculated using simple flat annual interest (Total Repayment = Principal + (Principal × 10% × Term / 12); Monthly = Total / Term).
            </p>
          </div>
        </div>

        {/* ── total repayment breakdown ──────────────────────────────── */}
        <div className="mt-10 max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            Total Repayment Overview
          </h2>
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" id="total-repayment-table">
                <thead>
                  <tr className="bg-secondary">
                    <th className="sticky left-0 z-10 bg-secondary px-5 py-4 text-left font-semibold whitespace-nowrap">
                      Loan Term
                    </th>
                    {PRINCIPALS.map((p) => (
                      <th
                        key={p}
                        className="px-5 py-4 text-center font-semibold whitespace-nowrap"
                      >
                        {fmt(p)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TERMS.map((term, i) => {
                    const isEven = i % 2 === 0;
                    return (
                      <tr
                        key={term}
                        className={`border-t border-border transition-colors hover:bg-muted/50 ${
                          isEven ? "" : "bg-muted/20"
                        }`}
                      >
                        <td className="sticky left-0 z-10 bg-card px-5 py-4 font-medium whitespace-nowrap">
                          {term} months
                        </td>
                        {PRINCIPALS.map((principal) => {
                          const total = totalRepayment(principal, term);
                          const interest = totalInterest(principal, term);
                          return (
                            <td
                              key={`${principal}-${term}`}
                              className="px-5 py-4 text-center tabular-nums"
                            >
                              <span>{fmt(total)}</span>
                              <span className="block text-xs text-muted-foreground mt-0.5">
                                Interest: {fmt(interest)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
      </div>

      {/* ── banking information section ─────────────────────────────── */}
      <div className="mt-16 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
          {/* section heading */}
          <div
            className="px-6 py-5 flex items-center gap-3"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Building2 className="h-6 w-6 text-primary-foreground" />
            <h2 className="text-xl font-bold text-primary-foreground">
              Banking Information & Deduction Schedule
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* scheduled deduction date */}
            <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-5">
              <div
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                style={{ background: "var(--gradient-hero)" }}
              >
                <CalendarDays className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Scheduled Deduction Date
                </h3>
                <p className="mt-1 text-muted-foreground text-sm">
                  Your monthly loan installment will be automatically deducted
                  on the{" "}
                  <span className="font-bold text-foreground">
                    5th of every month
                  </span>
                  . If the 5th falls on a weekend or public holiday, the
                  deduction will be processed on the{" "}
                  <span className="font-semibold text-foreground">
                    next business day
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* key details grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <DetailCard
                label="Deduction Method"
                value="ACH Auto-Debit"
                sub="Debited directly from your linked bank account."
              />
              <DetailCard
                label="Grace Period"
                value="5 Business Days"
                sub="Payments received within 5 business days of the due date incur no late fee."
              />
              <DetailCard
                label="Late Payment Fee"
                value="$25 or 5%"
                sub="Whichever is lesser, applied after the grace period."
              />
              <DetailCard
                label="Prepayment Penalty"
                value="None"
                sub="You can pay off your loan early at any time with no additional charges."
              />
            </div>

            {/* important notes */}
            <div className="rounded-xl border border-border bg-muted/20 p-5 text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4" /> Important Notes
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Ensure sufficient funds are available in your linked account by
                  the <strong>4th of each month</strong> to avoid failed
                  transactions.
                </li>
                <li>
                  Two consecutive failed deductions may result in a manual
                  payment requirement and additional processing fees.
                </li>
                <li>
                  To change your linked bank account, submit a request at least{" "}
                  <strong>10 business days</strong> before the next deduction
                  date.
                </li>
                <li>
                  All deductions are denominated in <strong>USD</strong> and
                  processed through the Federal Reserve ACH network.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div className="text-center mt-12">
        <Link
          to="/apply"
          className="inline-flex items-center rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
          style={{ background: "var(--gradient-hero)" }}
        >
          Apply for a Loan
        </Link>
        <p className="mt-3 text-xs text-muted-foreground">
          No impact to your credit score when you check your rate.
        </p>
      </div>
    </div>
  );
}

/* ── sub-components ───────────────────────────────────────────────────── */

function DetailCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
