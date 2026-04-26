import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="border-t border-gray-100 mt-16 py-8">
      <div className="max-w-3xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-foreground transition-colors">
          Terms of Service
        </Link>
        <Link href="/tokushoho" className="hover:text-foreground transition-colors">
          Legal Disclosure
        </Link>
        <span className="text-gray-600">&copy; 2026 A11yScope</span>
      </div>
    </footer>
  );
}
