"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[100px] pb-6 font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manage Your Finances <br /> with Intelligence
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <button className="px-8 py-3 rounded-2xl bg-black text-white hover:bg-gray-800 transition">
              Get Started
            </button>
          </Link>
          <Link href="https://www.youtube.com/roadsidecoder">
            <button className="px-8 py-3 rounded-2xl border border-gray-400 hover:bg-gray-100 transition">
              Watch Demo
            </button>
          </Link>
        </div>

        <div className="mt-10 max-w-5xl mx-auto perspective-[1000px]">
          <div
            className={`transform transition-transform duration-500 will-change-transform ${
              scrolled
                ? "rotate-x-0 translate-y-10"
                : "rotate-x-[15deg] translate-y-0"
            }`}
          >
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-2xl shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
