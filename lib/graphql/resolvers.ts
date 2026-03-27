import { conn } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface AutorRow extends RowDataPacket {
  cedula: string;
  nombre_completo: string;
  nacionalidad: string | null;
}

interface LibroRow extends RowDataPacket {
  isbn: string;
  titulo: string;
  editorial: string | null;
  genero: string | null;
  anio_publicacion: number | null;
  autor_cedula: string;
}

interface UsuarioRow extends RowDataPacket {
  id: number;
  nickname: string;
  tipo: "administrador" | "empleado";
}

export const resolvers = {
  // ── Queries ───────────────────────────────────────────────

  Query: {
    // Autores
    autores: async () => {
      const [rows] = await conn.query<AutorRow[]>("SELECT * FROM autores");
      return rows;
    },
    autor: async (_: unknown, { cedula }: { cedula: string }) => {
      const [rows] = await conn.query<AutorRow[]>(
        "SELECT * FROM autores WHERE cedula = ?",
        [cedula],
      );
      return rows[0] ?? null;
    },

    // Libros
    libros: async () => {
      const [rows] = await conn.query<LibroRow[]>("SELECT * FROM libros");
      return rows;
    },
    libro: async (_: unknown, { isbn }: { isbn: string }) => {
      const [rows] = await conn.query<LibroRow[]>(
        "SELECT * FROM libros WHERE isbn = ?",
        [isbn],
      );
      return rows[0] ?? null;
    },
    librosPorAutor: async (_: unknown, { cedula }: { cedula: string }) => {
      const [rows] = await conn.query<LibroRow[]>(
        "SELECT * FROM libros WHERE autor_cedula = ?",
        [cedula],
      );
      return rows;
    },

    // Usuarios
    usuarios: async () => {
      const [rows] = await conn.query<UsuarioRow[]>(
        "SELECT id, nickname, tipo FROM usuarios", // nunca devolvemos password
      );
      return rows;
    },
    usuario: async (_: unknown, { id }: { id: number }) => {
      const [rows] = await conn.query<UsuarioRow[]>(
        "SELECT id, nickname, tipo FROM usuarios WHERE id = ?",
        [id],
      );
      return rows[0] ?? null;
    },
  },

  // ── Resolvers de relaciones ────────────────────────────────
  // Esto es lo que hace GraphQL especial: resuelve relaciones automáticamente

  Autor: {
    // Cuando piden autor.libros, esto se ejecuta
    libros: async (autor: AutorRow) => {
      const [rows] = await conn.query<LibroRow[]>(
        "SELECT * FROM libros WHERE autor_cedula = ?",
        [autor.cedula],
      );
      return rows;
    },
  },

  Libro: {
    // Cuando piden libro.autor, esto se ejecuta
    autor: async (libro: LibroRow) => {
      const [rows] = await conn.query<AutorRow[]>(
        "SELECT * FROM autores WHERE cedula = ?",
        [libro.autor_cedula],
      );
      return rows[0] ?? null;
    },
  },

  // ── Mutations ─────────────────────────────────────────────

  Mutation: {
    // Autores
    crearAutor: async (
      _: unknown,
      args: { cedula: string; nombre_completo: string; nacionalidad?: string },
    ) => {
      await conn.query(
        "INSERT INTO autores (cedula, nombre_completo, nacionalidad) VALUES (?, ?, ?)",
        [args.cedula, args.nombre_completo, args.nacionalidad ?? null],
      );
      return args;
    },
    actualizarAutor: async (
      _: unknown,
      args: { cedula: string; nombre_completo: string; nacionalidad?: string },
    ) => {
      await conn.query(
        "UPDATE autores SET nombre_completo = COALESCE(?, nombre_completo), nacionalidad = COALESCE(?, nacionalidad) WHERE cedula = ?",
        [args.nombre_completo ?? null, args.nacionalidad ?? null, args.cedula],
      );
      const [rows] = await conn.query<AutorRow[]>(
        "SELECT * FROM autores WHERE cedula = ?",
        [args.cedula],
      );
      return rows[0];
    },
    eliminarAutor: async (_: unknown, { cedula }: { cedula: string }) => {
      await conn.query("DELETE FROM autores WHERE cedula = ?", [cedula]);
      return `Autor ${cedula} eliminado`;
    },

    // Libros
    crearLibro: async (
      _: unknown,
      args: {
        isbn: string;
        titulo: string;
        editorial?: string;
        genero?: string;
        anio_publicacion?: number;
        autor_cedula: string;
      },
    ) => {
      await conn.query(
        "INSERT INTO libros (isbn, titulo, editorial, genero, anio_publicacion, autor_cedula) VALUES (?, ?, ?, ?, ?, ?)",
        [
          args.isbn,
          args.titulo,
          args.editorial ?? null,
          args.genero ?? null,
          args.anio_publicacion ?? null,
          args.autor_cedula,
        ],
      );
      return args;
    },
    actualizarLibro: async (
      _: unknown,
      args: {
        isbn: string;
        titulo?: string;
        editorial?: string;
        genero?: string;
        anio_publicacion?: number;
      },
    ) => {
      await conn.query(
        `UPDATE libros SET
          titulo            = COALESCE(?, titulo),
          editorial         = COALESCE(?, editorial),
          genero            = COALESCE(?, genero),
          anio_publicacion  = COALESCE(?, anio_publicacion)
        WHERE isbn = ?`,
        [
          args.titulo ?? null,
          args.editorial ?? null,
          args.genero ?? null,
          args.anio_publicacion ?? null,
          args.isbn,
        ],
      );
      const [rows] = await conn.query<LibroRow[]>(
        "SELECT * FROM libros WHERE isbn = ?",
        [args.isbn],
      );
      return rows[0];
    },
    eliminarLibro: async (_: unknown, { isbn }: { isbn: string }) => {
      await conn.query("DELETE FROM libros WHERE isbn = ?", [isbn]);
      return `Libro ${isbn} eliminado`;
    },

    // Usuarios
    crearUsuario: async (
      _: unknown,
      args: {
        nickname: string;
        password: string;
        tipo: "administrador" | "empleado";
      },
    ) => {
      // En producción hashea el password antes de guardar
      const [result] = await conn.query<ResultSetHeader>(
        "INSERT INTO usuarios (nickname, password, tipo) VALUES (?, ?, ?)",
        [args.nickname, args.password, args.tipo],
      );
      return { id: result.insertId, nickname: args.nickname, tipo: args.tipo };
    },
    actualizarUsuario: async (
      _: unknown,
      args: {
        id: number;
        nickname?: string;
        tipo?: "administrador" | "empleado";
      },
    ) => {
      await conn.query(
        `UPDATE usuarios SET 
          nickname = COALESCE(?, nickname), 
          tipo = COALESCE(?, tipo) 
        WHERE id= ?`,
        [args.nickname ?? null, args.tipo ?? null, args.id],
      );
      const [rows] = await conn.query<UsuarioRow[]>(
        "SELECT id, nickname, tipo FROM usuarios WHERE id = ?",
        [args.id],
      );
      return rows[0];
    },
    eliminarUsuario: async (_: unknown, { id }: { id: number }) => {
      await conn.query("DELETE FROM usuarios WHERE id = ?", [id]);
      return `Usuario ${id} eliminado`;
    },
  },
};
