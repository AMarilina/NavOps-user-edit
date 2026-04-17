-- 1. Insertar Roles
INSERT INTO roles (id, name, description) VALUES
                                              (gen_random_uuid(), 'ADMIN', 'Administrador Global'),
                                              (gen_random_uuid(), 'CHIEF_NAVIGATION', 'Jefe de Navegación'),
                                              (gen_random_uuid(), 'CHIEF_OPERATIONS', 'Jefe de Operaciones')
    ON CONFLICT (name) DO NOTHING;

-- 2. Insertar Países
INSERT INTO countries (id, country_name, iso_code, created_at, version)
VALUES
    (gen_random_uuid(), 'Argentina', 'AR', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Paraguay', 'PY', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Uruguay', 'UY', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Bolivia', 'BO', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Chile', 'CL', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Perú', 'PE', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Colombia', 'CO', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Venezuela', 'VE', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Brazil', 'BR', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Ecuador', 'EC', CURRENT_TIMESTAMP, 1)
    ON CONFLICT (iso_code) DO NOTHING;