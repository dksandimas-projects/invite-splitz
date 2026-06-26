import Link from "next/link";
import { weddingConfig } from "@/lib/config";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-offwhite px-6 py-10">
      <div className="text-center max-w-md">
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey mb-3">
          404
        </p>
        <h1 className="font-serif text-section-heading text-charcoal mb-4">
          This page got lost on the way to the wedding.
        </h1>
        <p className="text-warm-grey mb-8 leading-relaxed">
          The link you followed doesn&apos;t go anywhere. Check the URL, or head
          back to {weddingConfig.coupleName}&apos;s invitation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full bg-sunflower text-charcoal text-sm font-medium hover:bg-sunflower-hover transition-colors"
          >
            Go to invitation
          </Link>
          <Link
            href="/dashboard/bretch-joyce"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full border border-garden text-forest text-sm font-medium hover:bg-stone-light transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
