"use client";
import { useEffect, useState } from "react";

export default function LibrosDeAutor() {
    interface Autor {
        cedula: string;
        nombre_completo: string;
        nacionalidad: string;
    }
    const [autores, setAutores] = useState<Autor[]>([]);
    const [libros, setLibros] = useState([]);
    const [cedulaSeleccionada, setCedulaSeleccionada] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        fetch("/api/autores")
            .then((res) => res.json())
            .then((data) => setAutores(data))
            .catch((err) => console.error("Error al cargar autores:", err));
    }, []);

    useEffect(() => {
        if (!cedulaSeleccionada) {
            setLibros([]);
            return;
        }

        setCargando(true);
        fetch(`/api/autores/${cedulaSeleccionada}/libros`)
            .then((res) => res.json())
            .then((data) => setLibros(data))
            .catch((err) => console.error("Error al cargar libros:", err))
            .finally(() => setCargando(false));
    }, [cedulaSeleccionada]);

    const autorSeleccionado = autores.find((a: any) => a.cedula === cedulaSeleccionada);

    return (
        <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Libros por Autor</h2>
                <select 
                    className="w-full p-2 mb-4 border rounded text-black"
                    value={cedulaSeleccionada}
                    onChange={(e) => setCedulaSeleccionada(e.target.value)}
                >
                <option value="">Selecciona un autor</option>
                {autores.map((autor: any) => (
                    <option key={autor.cedula} value={autor.cedula}>
                        {autor.cedula}
                    </option>
                ))}
            </select>

            {cargando && <p>Cargando libros...</p>}

            {!cargando && autorSeleccionado && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Libros de {autorSeleccionado.nombre_completo}
                    </h3>

                    {libros.length === 0 ? (
                        <p className="text-gray-600">No se encontraron libros para este autor.</p>
                    ) : (
                        <table className="min-w-full border rounded-lg overflow-hidden">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Editorial</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Género</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {libros.map((libro: any) => (
                                    <tr key={libro.isbn}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{libro.isbn}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{libro.titulo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{libro.editorial}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{libro.genero}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{libro.anio_publicacion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            
        </div>
    );
}