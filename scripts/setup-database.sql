-- Script para crear tabla de confirmaciones (opcional, si quieres usar base de datos)
CREATE TABLE IF NOT EXISTS confirmaciones_bautizo (
    id SERIAL PRIMARY KEY,
    adultos INTEGER NOT NULL,
    ninos INTEGER NOT NULL,
    nombres TEXT[] NOT NULL,
    mensaje TEXT,
    fecha_confirmacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO confirmaciones_bautizo (adultos, ninos, nombres, mensaje) VALUES
(2, 1, ARRAY['Juan Pérez', 'María Pérez', 'Pedrito Pérez'], 'Felicidades por este momento tan especial'),
(1, 0, ARRAY['Ana García'], 'Que Dios bendiga a Ashley en su nuevo camino');
