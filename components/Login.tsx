"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      //headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
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
    <div>
      <form onSubmit={manejarLogin}>
        <h1>Iniciar Sesión</h1>
        <input
          type="text"
          placeholder="Nickname"
          //value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          //value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}
