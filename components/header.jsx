"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { PenBox, Activity, Home, BarChart3, Menu, X } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { ModeToggle } from "./ui/ModeToggle";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(0);

  // Dynamically calculate menu height for animation
  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }
  }, [menuRef, mobileMenuOpen]);

  return (
    <header className="fixed top-0 w-full border-b border-border z-50 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex flex-wrap items-center justify-between px-2 md:px-4 py-2 md:py-3">
        {/* Logo + Mode Toggle */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-1 md:gap-2">
            <Image
              src="/favicon-light.png"
              alt="Finfold Logo Light"
              width={32}
              height={32}
              className="h-8 w-8 object-contain dark:hidden"
            />
            <Image
              src="/favicon-dark.png"
              alt="Finfold Logo Dark"
              width={32}
              height={32}
              className="h-8 w-8 object-contain hidden dark:block"
            />
            <span className="text-lg md:text-xl font-bold text-foreground">
              Finfold
            </span>
          </Link>
          <ModeToggle />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <a href="#features" className="text-muted-foreground hover:text-primary transition">
              Features
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition">
              Testimonials
            </a>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <Home size={18} />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="flex items-center gap-2 bg-sky-950 border-white">
                <PenBox size={18} />
                <span>Add</span>
              </Button>
            </Link>
            <Link href="/wealth">
              <Button className="flex items-center gap-2 bg-sky-950 border-white">
                <BarChart3 size={18} />
                <span>Wealth</span>
              </Button>
            </Link>
            <Link href="/swp">
              <Button className="flex items-center gap-2 bg-sky-950 border-white">
                <Activity size={18} />
                <span>SWP</span>
              </Button>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "w-10 h-10" } }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <SignedIn>
            <UserButton
              appearance={{ elements: { avatarBox: "w-8 h-8" } }}
            />
          </SignedIn>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Animated Mobile Menu */}
      <div
        ref={menuRef}
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: mobileMenuOpen ? `${menuHeight}px` : "0px" }}
      >
        <div className="bg-background border-t border-border w-full flex flex-col items-center gap-2 py-4">
          <SignedOut>
            <a href="#features" className="text-muted-foreground hover:text-primary transition text-sm">
              Features
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition text-sm">
              Testimonials
            </a>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="w-28 text-sm">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="w-28 text-sm flex items-center gap-2">
                <Home size={16} /> Home
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="w-28 text-sm flex items-center gap-2 bg-sky-950 border-white">
                <PenBox size={16} /> Add
              </Button>
            </Link>
            <Link href="/wealth">
              <Button className="w-28 text-sm flex items-center gap-2 bg-sky-950 border-white">
                <BarChart3 size={16} /> Wealth
              </Button>
            </Link>
            <Link href="/swp">
              <Button className="w-28 text-sm flex items-center gap-2 bg-sky-950 border-white">
                <Activity size={16} /> SWP
              </Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
