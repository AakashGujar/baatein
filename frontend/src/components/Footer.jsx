import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex items-center justify-center py-2">
        <p className="text-sm text-muted-foreground">
          Designed and developed by{" "}
          <Link
            href="https://aakashgujar.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Aakash
          </Link>
        </p>
      </div>
    </footer>
  );
}
