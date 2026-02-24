"use client";
import { useState, useEffect } from "react";

export default function FormularioLibro({ onLibroCreado, alCerrar }: any) {
  const [autores, setAutores] = useState([]);
  const [formData, setFormData] = useState({
    isbn: "",
    titulo: "",
    editorial: "",
    genero: "",
    anio_publicacion: "",
    autor_cedula: "",
  });

  useEffect(() => {
    fetch("/api/autores")
      .then((res) => res.json())
      .then((data) => setAutores(data))
      .catch((err) => console.error("Error al cargar autores:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/libros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Libro creado con éxito");
      onLibroCreado(); // Esta función recargará la lista en el componente padre
      alCerrar(); // Cierra el formulario
    } else {
      alert("Error al crear libro");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Registrar Nuevo Libro</h2>

        <label className="block mb-2 text-sm font-medium">ISBN</label>
        <input
          type="text"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
        />

        <label className="block mb-2 text-sm font-medium">Título</label>
        <input
          type="text"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
        />

        <label className="block mb-2 text-sm font-medium">Editorial</label>
        <input
          type="text"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, editorial: e.target.value })
          }
        />

        <label className="block mb-2 text-sm font-medium">Género</label>
        <input
          type="text"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
        />

        <label className="block mb-2 text-sm font-medium">
          Año de Publicación
        </label>
        <input
          type="number"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, anio_publicacion: e.target.value })
          }
        />

        <label className="block mb-2 text-sm font-medium">Autor</label>
        <select
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, autor_cedula: e.target.value })
          }
        >
          <option value="">Seleccione un autor</option>
          {autores.map((autor: any) => (
            <option key={autor.cedula} value={autor.cedula}>
              {autor.nombre_completo}
            </option>
          ))}
        </select>

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
            Guardar Libro
          </button>
        </div>
      </form>
    </div>
  );
}
