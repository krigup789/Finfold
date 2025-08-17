import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Activity, Home } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";
import {
  BarChart3,
  Receipt,
  // PieChart,
  // CreditCard,
  // Globe,
  // Zap,
} from "lucide-react";
import { ModeToggle } from "./ui/ModeToggle";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full border-b border-border z-50 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2">
          {/* Light mode logo */}
          <Image
            src="/favicon-light.png"
            alt="Finfold Logo Light"
            width={40}
            height={40}
            className="h-10 w-10 object-contain dark:hidden"
          />

          {/* Dark mode logo */}
          <Image
            src="/favicon-dark.png"
            alt="Finfold Logo Dark"
            width={40}
            height={40}
            className="h-10 w-10 object-contain hidden dark:block"
          />

          <span className="text-xl font-bold text-foreground">Finfold</span>
        </Link>


        <ModeToggle />
        </div>

        {/* Links for Signed Out */}
        <div className="hidden md:flex items-center gap-6">
          <SignedOut>
            <a href="#features" className="text-muted-foreground hover:text-primary transition">
              Features
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition">
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Actions / Auth Buttons */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2 ">
                <Home size={18} />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="flex items-center gap-2 bg-sky-950 border-white">
                <PenBox size={18} />
                <span className="hidden md:inline">Add</span>
              </Button>
            </Link>
            <Link href="/wealth">
              <Button className="flex items-center gap-2  bg-sky-950 border-white">
                <BarChart3 size={18} />
                <span className="hidden md:inline">Wealth</span>
              </Button>
            </Link>
            <Link href="/swp">
              <Button className="flex items-center gap-2  bg-sky-950 border-white">
                <Activity size={18} />
                <span className="hidden md:inline">SWP</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
