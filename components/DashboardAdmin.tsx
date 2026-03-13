"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CrudUsuarios from "./CrudUsuarios";
import CrudAutores from "./CrudAutores";
import CrudLibros from "./CrudLibros";

export default function DashboardAdmin() {
  const [seccion, setSeccion] = useState<"usuarios" | "autores" | "libros">(
    "autores",
  );
  const router = useRouter();
  const cerrarSesion = () => {
    document.cookie = "mi-token-biblioteca=; path=/; max-age=0";
    localStorage.clear();
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-800">
          AdminPanel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setSeccion("autores")}
            className={`w-full text-left p-3 rounded-lg transition ${seccion === "autores" ? "bg-indigo-700" : "hover:bg-indigo-800"}`}
          >
            📚 Gestión de Autores
          </button>
          <button
            onClick={() => setSeccion("libros")}
            className={`w-full text-left p-3 rounded-lg transition ${seccion === "libros" ? "bg-indigo-700" : "hover:bg-indigo-800"}`}
          >
            📖 Gestión de Libros
          </button>
          <button
            onClick={() => setSeccion("usuarios")}
            className={`w-full text-left p-3 rounded-lg transition ${seccion === "usuarios" ? "bg-indigo-700" : "hover:bg-indigo-800"}`}
          >
            👥 Gestión de Usuarios
          </button>
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={cerrarSesion}
            className="w-full text-left p-3 text-red-300 hover:text-red-100"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de Contenido */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {seccion === "autores" && "Administrar Autores"}
            {seccion === "libros" && "Administrar Libros"}
            {seccion === "usuarios" && "Administrar Usuarios"}
          </h1>
          <p className="text-gray-600">
            Desde aquí puedes crear, editar y eliminar registros.
          </p>
        </header>

        {/* Aquí es donde "inyectaremos" las tablas más adelante */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {seccion === "usuarios" && <CrudUsuarios />}
          {seccion === "autores" && <CrudAutores />}
          {seccion === "libros" && <CrudLibros />}
        </div>
      </main>
    </div>
  );
}
