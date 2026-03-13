"use client";
import { useState, useEffect } from "react";

export default function FormularioAutor({ onAutorCreado, alCerrar, autorAEditar = null }: any) {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  useEffect(() => {
    if (autorAEditar) {
      setCedula(autorAEditar.cedula);
      setNombre(autorAEditar.nombre_completo);
      setNacionalidad(autorAEditar.nacionalidad);
    }
  }, [autorAEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = autorAEditar ? `/api/autores/${autorAEditar.cedula}` : "/api/autores";
    const metodo = autorAEditar ? "PUT" : "POST";

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cedula, nombre_completo: nombre, nacionalidad }),
    });

    if (res.ok) {
      alert(autorAEditar ? "Autor actualizado con éxito" : "Autor creado con éxito");
      onAutorCreado(); // Esta función recargará la lista en el componente padre
      alCerrar(); // Cierra el formulario
    } else {
      alert(autorAEditar ? "Error al actualizar autor" : "Error al crear autor");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-6 rounded-xl shadow-lg w-full max-w-md border-black border-2"
      >
        <h2 className="text-xl font-bold mb-4 text-black">
          {autorAEditar ? "Editar Autor" : "Registrar Nuevo Autor"}
        </h2>

        <label className="block mb-2 text-sm font-medium text-black">Cédula</label>
        <input
          type="text"
          value={cedula}
          required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setCedula(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-black">
          Nombre Completo
        </label>
        <input
          type="text"
          value={nombre}
          required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setNombre(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-black">Nacionalidad</label>
        <input
          type="text"
          value={nacionalidad}
          required
          className="w-full p-2 mb-4 border rounded text-black"
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
