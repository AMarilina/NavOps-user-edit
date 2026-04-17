CREATE SEQUENCE personnel_file_seq START 1;

-- Limpiamos usuarios viejos incompletos para que el script corra limpio
DO $$
DECLARE
role_admin_id UUID;
    role_nav_id UUID;
    country_id UUID;
    user1_id UUID;
    user2_id UUID;
    person1_id UUID;
    person2_id UUID;
BEGIN
  -- 0. LIMPIEZA PREVIA (Ordenada por dependencias)
    -- Primero borramos los tripulantes usando el documento de la persona vinculada
DELETE FROM crew_members WHERE id IN (SELECT id FROM people WHERE document_number IN ('36397576', '35569789'));

-- Segundo borramos las personas
DELETE FROM people WHERE document_number IN ('36397576', '35569789');

-- Tercero borramos los usuarios
DELETE FROM users WHERE username IN ('admin', 'nav');

-- 1. Buscamos los IDs existentes
SELECT id INTO role_admin_id FROM roles WHERE name = 'ADMIN';
SELECT id INTO role_nav_id FROM roles WHERE name = 'CHIEF_NAVIGATION'; -- Verificá que este nombre sea exacto
SELECT id INTO country_id FROM countries WHERE iso_code = 'AR' LIMIT 1;

IF role_admin_id IS NULL OR role_nav_id IS NULL OR country_id IS NULL THEN
        RAISE EXCEPTION 'No se encontraron los roles o el país. Revisá la tabla roles y countries.';
END IF;

    -- 2. Insertar Usuarios (Password real para BCrypt: Admin123$)
    -- NOTA: Usá el hash real si querés loguearte, sino 'admin123' será texto plano y Spring Security no te dejará entrar.
INSERT INTO users (username, email, password_hash, role_id)
VALUES
    ('admin', 'ejemploprueba1112@gmail.com', '$2a$10$8v86K.IqR.uB.6uV9v.7O.XvW9A6S1Z7m8n5G5T3X9.6G5T3X9', role_admin_id),
    ('nav', 'fer@navops.com', '$2a$10$8v86K.IqR.uB.6uV9v.7O.XvW9A6S1Z7m8n5G5T3X9.6G5T3X9', role_nav_id);

SELECT id INTO user1_id FROM users WHERE username = 'admin';
SELECT id INTO user2_id FROM users WHERE username = 'nav';

-- 3. Insertar People
INSERT INTO people (full_name, surname, document_type, document_number, cuil, nationality, marital_status, gender, birth_date, country_id, email, address_city, address_province, user_id)
VALUES
    ('Maximiliano', 'Echeverria', 'DNI', '36397576', '20363975764', 'Argentina', 'SOLTERO', 'MASCULINO', '1994-05-15', country_id, 'ejemploprueba1112@gmail.com', 'Lomas de Zamora', 'Buenos Aires', user1_id),
    ('Fernando', 'Echeverria', 'DNI', '35569789', '20355697894', 'Argentina', 'CASADO', 'MASCULINO', '1991-09-05', country_id, 'fer@navops.com', 'Lanús', 'Buenos Aires', user2_id);

SELECT id INTO person1_id FROM people WHERE document_number = '36397576';
SELECT id INTO person2_id FROM people WHERE document_number = '35569789';

-- 4. Insertar Crew Members
INSERT INTO crew_members (id, file_number, maritime_book_number, navigation_role, category, hire_date, status)
VALUES
    (person1_id, 'LG00001', 'MAT-1234-A', 'Capitán', 'Senior', '2020-01-10', 'ACTIVE'),
    (person2_id, 'LG00002', 'MAT-5678-B', 'Oficial de Cubierta', 'Junior', '2022-03-15', 'ACTIVE');

-- 5. Secuencia
PERFORM setval('personnel_file_seq', 2);

    RAISE NOTICE 'Carga completa exitosa.';

END $$;