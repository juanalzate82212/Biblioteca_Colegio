CREATE DATABASE biblioteca_colegio;
USE biblioteca_colegio;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tipo ENUM('administrador', 'empleado') NOT NULL
);

CREATE TABLE autores (
    cedula VARCHAR(20) PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50)
);

CREATE TABLE libros (
    isbn VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    editorial VARCHAR(100),
    genero VARCHAR(50),
    anio_publicacion INT,
    autor_cedula VARCHAR(20),
    CONSTRAINT fk_autor FOREIGN KEY (autor_cedula)
        REFERENCES autores (cedula)
);