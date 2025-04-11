import Link from "next/link"
import Logo from "./logo"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 bg-ultramarine text-white">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Logo variant="white" />
          <p className="text-center text-sm text-white/80 md:text-left">
            &copy; {new Date().getFullYear()} CRAFTERS. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Platform</h3>
            <nav className="flex flex-col gap-2 text-sm text-white/80">
              <Link href="/about" className="hover:text-white">
                About
              </Link>
              <Link href="/features" className="hover:text-white">
                Features
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Resources</h3>
            <nav className="flex flex-col gap-2 text-sm text-white/80">
              <Link href="/help" className="hover:text-white">
                Help Center
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/blog" className="hover:text-white">
                Blog
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Legal</h3>
            <nav className="flex flex-col gap-2 text-sm text-white/80">
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-white">
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
