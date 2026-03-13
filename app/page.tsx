"use client";

import Login from "@/components/Login";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.cookie = "mi-token-biblioteca=; path=/; max-age=0";
    localStorage.clear();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Login />
    </main>
  );
}
