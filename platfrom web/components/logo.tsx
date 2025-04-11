import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "default" | "white" | "small"
  className?: string
}

export default function Logo({ variant = "default", className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Image
          src="/logo.png"
          alt="MATCHVISOR Logo"
          width={variant === "small" ? 32 : 40}
          height={variant === "small" ? 32 : 40}
          className="object-contain"
        />
      </div>
      <span
        className={`font-display font-bold text-xl ${variant === "white" ? "text-white" : "text-foreground"} ${variant === "small" ? "text-base" : ""}`}
      >
        MATCHVISOR
      </span>
    </Link>
  )
}
