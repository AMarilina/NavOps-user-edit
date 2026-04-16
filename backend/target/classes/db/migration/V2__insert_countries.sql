-- Insertar países solo si no existen (evita errores de duplicados)
INSERT INTO countries (id, country_name, iso_code, created_at, version)
VALUES
    (gen_random_uuid(), 'Argentina', 'AR', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Paraguay', 'PY', CURRENT_TIMESTAMP, 1),
    (gen_random_uuid(), 'Uruguay', 'UY', CURRENT_TIMESTAMP, 1)
    ON CONFLICT (id) DO NOTHING;
-- O mejor aún, si tenés un índice único por nombre o código ISO:
-- ON CONFLICT (iso_code) DO NOTHING;