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

-- Insertar un autor
INSERT INTO autores (cedula, nombre_completo, nacionalidad) 
VALUES ('80123', 'Isabel Allende', 'Chilena');

-- Insertar un libro asociado a esa cédula
INSERT INTO libros (isbn, titulo, editorial, genero, anio_publicacion, autor_cedula)
VALUES ('978-840', 'La Casa de los Espíritus', 'Plaza & Janés', 'Realismo Mágico', 1982, '80123');

-- Crear un usuario administrador
INSERT INTO usuarios (nickname, password, tipo) 
VALUES ('admin_juan', 'claveSegura123', 'administrador');