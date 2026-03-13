"use client";
import { useRouter } from "next/navigation";
import LibrosDeAutor from "./LibrosDeAutor";

export default function ReporteUsuario() {
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
          Panel de Empleado
        </div>
        <nav className="flex-1 p-4 space-y-2"></nav>
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={cerrarSesion}
            className="w-full text-left p-3 text-red-300 hover:text-red-100"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Reporte de Usuario
          </h1>
          <p className="text-gray-600">
            Aquí puedes ver el reporte de los autores y sus libros.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <LibrosDeAutor />
        </div>
      </main>
    </div>
  );
}
