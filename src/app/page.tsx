"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Menu = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsLoading(false);
        router.push("/client");
      }, 500);
    }, 2000); 

    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 ${isFadingOut ? 'fade-out' : ''}`}>
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-accent-green transition-opacity duration-500 opacity-100"></div>
        <Image 
          src="/logo.png" 
          alt="Logo"
          width={160} 
          height={160} 
          className="w-32 md:w-40 mt-8 transition-opacity duration-500 opacity-100" 
        />
        <p className="mt-4 text-gray-800 text-lg font-semibold transition-opacity duration-500 opacity-100">
          Carregando seu gift...
        </p>
        <p className="mt-2 text-gray-600 text-sm transition-opacity duration-500 opacity-100">
          Isso pode levar alguns segundos
        </p>
      </div>
    );
  }

  return (
    <></>
  );
};

export default Menu;