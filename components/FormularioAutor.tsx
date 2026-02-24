"use client";
import { useState, useEffect } from "react";

export default function FormularioAutor({ onAutorCreado, alCerrar }: any) {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [nacionalidad, setNacionalidad] = useState("empleado");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/autores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cedula, nombre_completo: nombre, nacionalidad }),
    });

    if (res.ok) {
      alert("Autor creado con éxito");
      onAutorCreado(); // Esta función recargará la lista en el componente padre
      alCerrar(); // Cierra el formulario
    } else {
      alert("Error al crear autor");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Registrar Nuevo Autor</h2>

        <label className="block mb-2 text-sm font-medium">Cédula</label>
        <input
          type="text"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setCedula(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium">
          Nombre Completo
        </label>
        <input
          type="text"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setNombre(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium">Nacionalidad</label>
        <input
          type="text"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setNacionalidad(e.target.value)}
        />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={alCerrar}
            className="px-4 py-2 text-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Guardar Autor
          </button>
        </div>
      </form>
    </div>
  );
}
