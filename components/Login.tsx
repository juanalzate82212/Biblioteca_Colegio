"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.cookie = "mi-token-biblioteca=; path=/; max-age=0";
    localStorage.clear();
  }, []);

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      //headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // localStorage.setItem("token", data.token);
      document.cookie = `mi-token-biblioteca=${data.token}; path=/; max-age=3600`;
      if (data.role === "administrador") {
        router.push("/dashboard-admin");
      } else {
        router.push("/reporte_usuario");
      }
    } else {
      alert("Error en el login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 rounded-2xl shadow-lg p-10">
      <form className="items-center justify-center" onSubmit={manejarLogin}>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Iniciar Sesión</h1>
        <input
          type="text"
          placeholder="Nickname"
          //value={nickname}
          className="text-black border rounded p-2 mb-4 w-full"
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          //value={password}
          className="text-black border rounded p-2 mb-4 w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}