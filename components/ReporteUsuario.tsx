"use client";
import { useRouter } from "next/navigation";

export default function ReporteUsuario() {
  const router = useRouter();
    const cerrarSesion = () => {
      document.cookie = "mi-token-biblioteca=; path=/; max-age=0";
      localStorage.clear();
      router.replace("/");
      router.refresh();
    };

  return (
    <div>
      <h1>Reporte de Usuario</h1>
      {/* Aquí puedes agregar el contenido del reporte de usuario */}
      <button
        onClick={cerrarSesion}
        className="w-full text-left p-3 text-red-300 hover:text-red-100"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
