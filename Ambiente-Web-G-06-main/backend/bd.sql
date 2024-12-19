-- Crear la tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);

--Crea la tabla empleados
create table empleados (
    idEmpleado int auto_increment primary key,
    user_id int not null,
    nombreEmpleado varchar (50),
    direccion text,
    contacto int,
    email varchar(100)not null,
    puesto varchar(60),
    horario varchar(50),
    constraint empleados_fk_1 foreign key (user_id) references users (id) on delete cascade
):