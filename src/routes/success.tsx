import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [
      { title: "Application Submitted — VercelLoans" },
      { name: "description", content: "Your loan application has been received successfully." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/20">
        <CheckCircle2 className="h-8 w-8 text-accent" />
      </div>
      <h1 className="mt-6 text-3xl md:text-4xl font-bold">
        Application Submitted Successfully!
      </h1>
      <p className="mt-3 text-muted-foreground">
        Thank you for choosing VercelLoans. Your application details have been submitted and forwarded for expedited review.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
        <h3 className="font-semibold text-lg text-foreground mb-3">What happens next?</h3>
        <ol className="space-y-3 text-sm text-muted-foreground list-decimal ml-5">
          <li>
            <strong className="text-foreground">Application Review:</strong> Our underwriting team will verify your submitted details within 24–48 business hours.
          </li>
          <li>
            <strong className="text-foreground">Direct Email Update:</strong> You will receive an official loan agreement and status notification directly in your inbox.
          </li>
          <li>
            <strong className="text-foreground">Funds Disbursement:</strong> Upon final electronic signing, approved funds will be directly deposited to your linked checking account.
          </li>
        </ol>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Return to Home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
