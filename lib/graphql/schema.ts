import { gql } from 'graphql-tag'

export const typeDefs = gql`

  type Autor {
    cedula:        String!
    nombre_completo: String!
    nacionalidad:  String
    libros:        [Libro]
  }

  type Libro {
    isbn:             String!
    titulo:           String!
    editorial:        String
    genero:           String
    anio_publicacion: Int
    autor:            Autor
  }

  type Usuario {
    id:       Int!
    nickname: String!
    tipo:     TipoUsuario!
  }

  enum TipoUsuario {
    administrador
    empleado
  }


  type Query {
    autores:           [Autor]
    autor(cedula: String!): Autor

    libros:            [Libro]
    libro(isbn: String!): Libro
    librosPorAutor(cedula: String!): [Libro]

    usuarios:          [Usuario]
    usuario(id: Int!): Usuario
  }


  type Mutation {
    crearAutor(cedula: String!, nombre_completo: String!, nacionalidad: String): Autor
    actualizarAutor(cedula: String!, nombre_completo: String, nacionalidad: String): Autor
    eliminarAutor(cedula: String!): String

    crearLibro(isbn: String!, titulo: String!, editorial: String, genero: String, anio_publicacion: Int, autor_cedula: String!): Libro
    actualizarLibro(isbn: String!, titulo: String, editorial: String, genero: String, anio_publicacion: Int): Libro
    eliminarLibro(isbn: String!): String

    crearUsuario(nickname: String!, password: String!, tipo: TipoUsuario!): Usuario
    actualizarUsuario(id: Int!, nickname: String, tipo: TipoUsuario): Usuario
    eliminarUsuario(id: Int!): String
  }
`