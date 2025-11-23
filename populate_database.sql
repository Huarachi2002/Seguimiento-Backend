-- ================================================================
-- SCRIPT DE POBLACIÓN DE BASE DE DATOS - SISTEMA DE SEGUIMIENTO TB
-- ================================================================
-- Este script genera datos de prueba para el sistema de seguimiento
-- de tratamiento de Tuberculosis
-- Ejecutar dentro del contenedor PostgreSQL
-- ================================================================

-- Limpieza de datos existentes (opcional - comentar si no desea limpiar)
-- TRUNCATE TABLE cita, laboratorio, paciente_sintoma, paciente_enfermedad, 
-- contacto_paciente, tratamiento_tb, paciente, direccion, "user" CASCADE;

-- ================================================================
-- 1. USUARIOS ADICIONALES
-- ================================================================
-- Obtener los IDs de roles existentes
DO $$
DECLARE
    rol_doctor_id UUID;
    rol_licenciado_id UUID;
    rol_admin_id UUID;
    existing_user INTEGER;
BEGIN
    -- Obtener IDs de roles
    SELECT id INTO rol_doctor_id FROM rol WHERE descripcion = 'Doctor' LIMIT 1;
    SELECT id INTO rol_licenciado_id FROM rol WHERE descripcion = 'Licenciado' LIMIT 1;
    SELECT id INTO rol_admin_id FROM rol WHERE descripcion = 'Admin' LIMIT 1;

    -- Verificar y crear usuarios solo si no existen
    SELECT COUNT(*) INTO existing_user FROM "user" WHERE username = 'dr.martinez';
    IF existing_user = 0 THEN
        INSERT INTO "user" (id, username, contrasena, nombre, fecha_login, estado, email, telefono, notificar_email, notificar_whatsapp, "rolId", created_at, updated_at)
        VALUES (gen_random_uuid(), 'dr.martinez', '123', 'Dr. Carlos Martinez', NOW(), true, 'dr.martinez@hospital.com', '77123456', true, true, rol_doctor_id, NOW(), NOW());
    END IF;

    SELECT COUNT(*) INTO existing_user FROM "user" WHERE username = 'dr.rodriguez';
    IF existing_user = 0 THEN
        INSERT INTO "user" (id, username, contrasena, nombre, fecha_login, estado, email, telefono, notificar_email, notificar_whatsapp, "rolId", created_at, updated_at)
        VALUES (gen_random_uuid(), 'dr.rodriguez', '123', 'Dra. Ana Rodriguez', NOW(), true, 'dra.rodriguez@hospital.com', '77234567', true, true, rol_doctor_id, NOW(), NOW());
    END IF;

    SELECT COUNT(*) INTO existing_user FROM "user" WHERE username = 'dr.lopez';
    IF existing_user = 0 THEN
        INSERT INTO "user" (id, username, contrasena, nombre, fecha_login, estado, email, telefono, notificar_email, notificar_whatsapp, "rolId", created_at, updated_at)
        VALUES (gen_random_uuid(), 'dr.lopez', '123', 'Dr. Luis Lopez', NOW(), true, 'dr.lopez@hospital.com', '77345678', true, false, rol_doctor_id, NOW(), NOW());
    END IF;

    SELECT COUNT(*) INTO existing_user FROM "user" WHERE username = 'lic.garcia';
    IF existing_user = 0 THEN
        INSERT INTO "user" (id, username, contrasena, nombre, fecha_login, estado, email, telefono, notificar_email, notificar_whatsapp, "rolId", created_at, updated_at)
        VALUES (gen_random_uuid(), 'lic.garcia', '123', 'Lic. Maria Garcia', NOW(), true, 'lic.garcia@hospital.com', '77456789', true, true, rol_licenciado_id, NOW(), NOW());
    END IF;

    SELECT COUNT(*) INTO existing_user FROM "user" WHERE username = 'lic.fernandez';
    IF existing_user = 0 THEN
        INSERT INTO "user" (id, username, contrasena, nombre, fecha_login, estado, email, telefono, notificar_email, notificar_whatsapp, "rolId", created_at, updated_at)
        VALUES (gen_random_uuid(), 'lic.fernandez', '123', 'Lic. Jose Fernandez', NOW(), true, 'lic.fernandez@hospital.com', '77567890', false, true, rol_licenciado_id, NOW(), NOW());
    END IF;

    SELECT COUNT(*) INTO existing_user FROM "user" WHERE username = 'lic.ramirez';
    IF existing_user = 0 THEN
        INSERT INTO "user" (id, username, contrasena, nombre, fecha_login, estado, email, telefono, notificar_email, notificar_whatsapp, "rolId", created_at, updated_at)
        VALUES (gen_random_uuid(), 'lic.ramirez', '123', 'Lic. Sofia Ramirez', NOW(), true, 'lic.ramirez@hospital.com', '77678901', true, true, rol_licenciado_id, NOW(), NOW());
    END IF;

    RAISE NOTICE 'Usuarios creados exitosamente!';
END $$;

-- ================================================================
-- 2. PACIENTES (200 pacientes)
-- ================================================================
DO $$
DECLARE
    i INTEGER;
    zona_mza_ids UUID[];
    zona_id UUID;
    paciente_id UUID;
    direccion_id UUID;
    nombre_completo TEXT;
    nombres TEXT[] := ARRAY['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'Pedro', 'Rosa', 'Jorge', 'Isabel',
                            'Miguel', 'Laura', 'Ricardo', 'Patricia', 'Fernando', 'Elena', 'Roberto', 'Silvia', 'Diego', 'Monica',
                            'Andrés', 'Gloria', 'Manuel', 'Teresa', 'Francisco', 'Beatriz', 'Javier', 'Claudia', 'Alberto', 'Cristina',
                            'Raúl', 'Angela', 'Pablo', 'Susana', 'Sergio', 'Lidia', 'Ramón', 'Natalia', 'Oscar', 'Veronica',
                            'Victor', 'Adriana', 'Eduardo', 'Gabriela', 'Arturo', 'Daniela', 'Gustavo', 'Marcela', 'Héctor', 'Sandra'];
    apellidos TEXT[] := ARRAY['González', 'Rodríguez', 'Martínez', 'García', 'López', 'Fernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
                              'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Herrera', 'Jiménez', 'Mendoza', 'Vargas',
                              'Castro', 'Romero', 'Ortiz', 'Silva', 'Gutiérrez', 'Rojas', 'Medina', 'Vega', 'Reyes', 'Campos'];
    genero INTEGER;
    tipo_doc INTEGER;
    fecha_nac DATE;
    telefono BIGINT;
    tiene_wp BOOLEAN;
BEGIN
    -- Obtener todos los IDs de zona_mza
    SELECT ARRAY_AGG(id) INTO zona_mza_ids FROM zona_mza;

    FOR i IN 1..200 LOOP
        -- Seleccionar zona aleatoria
        zona_id := zona_mza_ids[1 + floor(random() * array_length(zona_mza_ids, 1))::int];
        
        -- Generar datos del paciente
        genero := floor(random() * 2)::INTEGER; -- 0: Masculino, 1: Femenino
        tipo_doc := floor(random() * 2 + 1)::INTEGER; -- 1: CI, 2: Pasaporte
        fecha_nac := DATE '1940-01-01' + (random() * 25000)::INTEGER; -- Entre 1940 y ~2008
        telefono := 70000000 + floor(random() * 20000000)::BIGINT;
        tiene_wp := random() > 0.3; -- 70% tiene WhatsApp
        
        nombre_completo := nombres[1 + floor(random() * array_length(nombres, 1))::int] || ' ' || 
                          apellidos[1 + floor(random() * array_length(apellidos, 1))::int] || ' ' ||
                          apellidos[1 + floor(random() * array_length(apellidos, 1))::int];
        
        paciente_id := gen_random_uuid();
        direccion_id := gen_random_uuid();
        
        -- Insertar dirección
        INSERT INTO direccion (id, descripcion, nro_casa, latitud, longitud, "zonaId", created_at, updated_at)
        VALUES (
            direccion_id,
            'Av. ' || apellidos[1 + floor(random() * array_length(apellidos, 1))::int] || ' #' || (100 + floor(random() * 900)::int),
            floor(random() * 500 + 1)::INTEGER,
            -17.78 + (random() * 0.1 - 0.05),
            -63.18 + (random() * 0.1 - 0.05),
            zona_id,
            NOW(),
            NOW()
        );
        
        -- Insertar paciente
        INSERT INTO paciente (id, nombre, numero_doc, tipo_doc, fecha_nacimiento, genero, email, telefono, tiene_whatsapp, estado, "direccionId", created_at, updated_at)
        VALUES (
            paciente_id,
            nombre_completo,
            'DOC-' || LPAD(i::TEXT, 8, '0'),
            tipo_doc,
            fecha_nac,
            genero,
            LOWER(REPLACE(nombre_completo, ' ', '.')) || i || '@email.com',
            telefono,
            tiene_wp,
            true,
            direccion_id,
            NOW() - (random() * interval '365 days'),
            NOW()
        );
        
        IF i % 50 = 0 THEN
            RAISE NOTICE 'Creados % pacientes...', i;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Pacientes creados exitosamente!';
END $$;

-- ================================================================
-- 3. CONTACTOS DE PACIENTES (2-4 contactos por paciente)
-- ================================================================
DO $$
DECLARE
    paciente_rec RECORD;
    tipo_parentesco_ids UUID[];
    num_contactos INTEGER;
    j INTEGER;
    tipo_id UUID;
    nombre_contacto TEXT;
    nombres TEXT[] := ARRAY['María', 'Juan', 'Pedro', 'Ana', 'Luis', 'Carmen', 'Rosa', 'Jorge', 'Elena', 'Carlos'];
    apellidos TEXT[] := ARRAY['González', 'López', 'Martínez', 'García', 'Pérez', 'Rodríguez', 'Sánchez', 'Ramírez'];
BEGIN
    -- Obtener tipos de parentesco
    SELECT ARRAY_AGG(id) INTO tipo_parentesco_ids FROM tipo_parentesco;
    
    FOR paciente_rec IN SELECT id FROM paciente LOOP
        num_contactos := 2 + floor(random() * 3)::INTEGER; -- Entre 2 y 4 contactos
        
        FOR j IN 1..num_contactos LOOP
            tipo_id := tipo_parentesco_ids[1 + floor(random() * array_length(tipo_parentesco_ids, 1))::int];
            nombre_contacto := nombres[1 + floor(random() * array_length(nombres, 1))::int] || ' ' ||
                              apellidos[1 + floor(random() * array_length(apellidos, 1))::int];
            
            INSERT INTO contacto_paciente (id, nombre_contacto, numero_telefono_contacto, direccion, emergencia, tiene_whatsapp, "pacienteId", "tipoParentescoId", created_at, updated_at)
            VALUES (
                gen_random_uuid(),
                nombre_contacto,
                '7' || LPAD(floor(random() * 10000000)::TEXT, 7, '0'),
                'Calle ' || (1 + floor(random() * 50)::int) || ' #' || (100 + floor(random() * 500)::int),
                j = 1, -- El primer contacto es de emergencia
                random() > 0.4,
                paciente_rec.id,
                tipo_id,
                NOW(),
                NOW()
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Contactos creados exitosamente!';
END $$;

-- ================================================================
-- 4. ENFERMEDADES Y SÍNTOMAS DE PACIENTES
-- ================================================================
DO $$
DECLARE
    paciente_rec RECORD;
    enfermedad_ids UUID[];
    sintoma_ids UUID[];
    num_enfermedades INTEGER;
    num_sintomas INTEGER;
    i INTEGER;
    j INTEGER;
    enfermedad_id UUID;
    sintoma_id UUID;
BEGIN
    -- Obtener IDs de enfermedades y síntomas
    SELECT ARRAY_AGG(id) INTO enfermedad_ids FROM enfermedad;
    SELECT ARRAY_AGG(id) INTO sintoma_ids FROM sintoma;
    
    FOR paciente_rec IN SELECT id FROM paciente LOOP
        -- 40% de pacientes tienen comorbilidades
        IF random() > 0.6 THEN
            num_enfermedades := 1 + floor(random() * 3)::INTEGER; -- 1 a 3 enfermedades
            
            FOR i IN 1..num_enfermedades LOOP
                enfermedad_id := enfermedad_ids[1 + floor(random() * array_length(enfermedad_ids, 1))::int];
                
                INSERT INTO paciente_enfermedad (id, id_paciente, id_enfermedad, created_at, updated_at)
                VALUES (gen_random_uuid(), paciente_rec.id, enfermedad_id, NOW(), NOW())
                ON CONFLICT DO NOTHING;
            END LOOP;
        END IF;
        
        -- Todos los pacientes tienen síntomas (2-5 síntomas)
        num_sintomas := 2 + floor(random() * 4)::INTEGER;
        
        FOR j IN 1..num_sintomas LOOP
            sintoma_id := sintoma_ids[1 + floor(random() * array_length(sintoma_ids, 1))::int];
            
            INSERT INTO paciente_sintoma (id, id_paciente, id_sintoma, created_at, updated_at)
            VALUES (gen_random_uuid(), paciente_rec.id, sintoma_id, NOW(), NOW())
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Enfermedades y síntomas asignados exitosamente!';
END $$;

-- ================================================================
-- 5. TRATAMIENTOS TB (1-2 tratamientos por paciente)
-- ================================================================
DO $$
DECLARE
    paciente_rec RECORD;
    tipo_tratamiento_ids UUID[];
    estado_tratamiento_ids UUID[];
    fase_tratamiento_ids UUID[];
    localizacion_ids UUID[];
    tratamiento_id UUID;
    fecha_inicio DATE;
    dias_transcurridos INTEGER;
    tipo_trat_id UUID;
    estado_trat_id UUID;
    fase_trat_id UUID;
    localizacion_id UUID;
    contador INTEGER := 0;
    estado_en_curso_id UUID;
    fase_comenzado_id UUID;
    fase_intensivo_id UUID;
    fase_continuacion_id UUID;
BEGIN
    -- Obtener IDs
    SELECT ARRAY_AGG(id) INTO tipo_tratamiento_ids FROM tipo_tratamiento;
    SELECT ARRAY_AGG(id) INTO estado_tratamiento_ids FROM estado_tratamiento;
    SELECT ARRAY_AGG(id) INTO fase_tratamiento_ids FROM fase_tratamiento;
    SELECT ARRAY_AGG(id) INTO localizacion_ids FROM localizacion_tb;
    
    -- Obtener IDs específicos para estados y fases
    SELECT id INTO estado_en_curso_id FROM estado_tratamiento WHERE descripcion = 'En Curso' LIMIT 1;
    SELECT id INTO fase_comenzado_id FROM fase_tratamiento WHERE descripcion = 'Comenzado' LIMIT 1;
    SELECT id INTO fase_intensivo_id FROM fase_tratamiento WHERE descripcion = 'Intensivo' LIMIT 1;
    SELECT id INTO fase_continuacion_id FROM fase_tratamiento WHERE descripcion = 'Continuación' LIMIT 1;
    
    FOR paciente_rec IN SELECT id FROM paciente ORDER BY random() LOOP
        contador := contador + 1;
        tratamiento_id := gen_random_uuid();
        
        -- 80% tiene 1 tratamiento, 15% tiene 2, 5% tiene ninguno
        IF random() > 0.05 THEN
            -- Primer tratamiento (puede ser antiguo o actual)
            fecha_inicio := CURRENT_DATE - (random() * 730)::INTEGER; -- Hasta 2 años atrás
            dias_transcurridos := CURRENT_DATE - fecha_inicio;
            tipo_trat_id := tipo_tratamiento_ids[1 + floor(random() * array_length(tipo_tratamiento_ids, 1))::int];
            localizacion_id := localizacion_ids[1 + floor(random() * array_length(localizacion_ids, 1))::int];
            
            -- Determinar estado y fase según días transcurridos
            IF dias_transcurridos < 60 THEN
                estado_trat_id := estado_en_curso_id;
                fase_trat_id := fase_intensivo_id;
            ELSIF dias_transcurridos < 180 THEN
                estado_trat_id := estado_en_curso_id;
                fase_trat_id := fase_continuacion_id;
            ELSE
                -- Tratamiento completado
                estado_trat_id := estado_tratamiento_ids[1 + floor(random() * (array_length(estado_tratamiento_ids, 1) - 1))::int];
                fase_trat_id := fase_tratamiento_ids[3]; -- Completado
            END IF;
            
            tratamiento_id := gen_random_uuid();
            
            INSERT INTO "tratamiento_tb" (
                id, fecha_inicio, fecha_fin, 
                observaciones, 
                "pacienteId", "tipoTratamientoId", "estadoId", "faseId", "localizacionId",
                created_at, updated_at
            )
            VALUES (
                tratamiento_id,
                fecha_inicio,
                CASE WHEN dias_transcurridos >= 180 THEN fecha_inicio + 180 ELSE NULL END,
                CASE 
                    WHEN random() > 0.7 THEN 'Paciente con buena adherencia'
                    WHEN random() > 0.4 THEN 'Requiere seguimiento cercano'
                    ELSE 'Evolución favorable'
                END,
                paciente_rec.id,
                tipo_trat_id,
                estado_trat_id,
                fase_trat_id,
                localizacion_id,
                fecha_inicio,
                NOW()
            );
            
            -- 15% tiene un segundo tratamiento (recaída)
            IF random() > 0.85 THEN
                fecha_inicio := CURRENT_DATE - (random() * 365)::INTEGER;
                dias_transcurridos := CURRENT_DATE - fecha_inicio;
                
                -- Segundo tratamiento siempre es recaída o retratamiento
                SELECT id INTO tipo_trat_id FROM tipo_tratamiento WHERE descripcion IN ('Recaída', 'Retratamiento') ORDER BY random() LIMIT 1;
                
                IF dias_transcurridos < 60 THEN
                    estado_trat_id := estado_en_curso_id;
                    fase_trat_id := fase_intensivo_id;
                ELSIF dias_transcurridos < 180 THEN
                    estado_trat_id := estado_en_curso_id;
                    fase_trat_id := fase_continuacion_id;
                ELSE
                    estado_trat_id := estado_tratamiento_ids[1 + floor(random() * array_length(estado_tratamiento_ids, 1))::int];
                    fase_trat_id := fase_tratamiento_ids[3];
                END IF;
                
                contador := contador + 1;
                
                INSERT INTO "tratamiento_tb" (
                    id, fecha_inicio, fecha_fin, 
                    observaciones, 
                    "pacienteId", "tipoTratamientoId", "estadoId", "faseId", "localizacionId",
                    created_at, updated_at
                )
                VALUES (
                    gen_random_uuid(),
                    fecha_inicio,
                    CASE WHEN dias_transcurridos >= 180 THEN fecha_inicio + 180 ELSE NULL END,
                    'Recaída - Nuevo esquema de tratamiento',
                    paciente_rec.id,
                    tipo_trat_id,
                    estado_trat_id,
                    fase_trat_id,
                    localizacion_id,
                    fecha_inicio,
                    NOW()
                );
            END IF;
        END IF;
        
        IF contador % 50 = 0 THEN
            RAISE NOTICE 'Creados % tratamientos...', contador;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Tratamientos creados exitosamente!';
END $$;

-- ================================================================
-- 6. CITAS (múltiples citas por tratamiento)
-- ================================================================
DO $$
DECLARE
    tratamiento_rec RECORD;
    user_ids UUID[];
    tipo_cita_ids UUID[];
    estado_cita_ids UUID[];
    motivo_ids UUID[];
    num_citas INTEGER;
    i INTEGER;
    fecha_cita DATE;
    user_id UUID;
    tipo_cita_id UUID;
    estado_cita_id UUID;
    motivo_id UUID;
    dias_entre_citas INTEGER;
    estado_asistido_id UUID;
    estado_perdido_id UUID;
    estado_programado_id UUID;
    tipo_medicamentos_id UUID;
    tipo_revision_id UUID;
    duracion_dias INTEGER;
BEGIN
    -- Obtener IDs
    SELECT ARRAY_AGG(id) INTO user_ids FROM "user";
    SELECT ARRAY_AGG(id) INTO tipo_cita_ids FROM tipo_cita;
    SELECT ARRAY_AGG(id) INTO estado_cita_ids FROM estado_cita;
    SELECT ARRAY_AGG(id) INTO motivo_ids FROM motivo;
    
    -- Obtener IDs específicos
    SELECT id INTO estado_asistido_id FROM estado_cita WHERE descripcion = 'Asistido' LIMIT 1;
    SELECT id INTO estado_perdido_id FROM estado_cita WHERE descripcion = 'Perdido' LIMIT 1;
    SELECT id INTO estado_programado_id FROM estado_cita WHERE descripcion = 'Programado' LIMIT 1;
    SELECT id INTO tipo_medicamentos_id FROM tipo_cita WHERE descripcion = 'Toma de medicamentos' LIMIT 1;
    SELECT id INTO tipo_revision_id FROM tipo_cita WHERE descripcion = 'Revisión médica' LIMIT 1;
    
    FOR tratamiento_rec IN 
        SELECT id, fecha_inicio, fecha_fin
        FROM tratamiento_tb
    LOOP
        -- Calcular duración del tratamiento
        -- Calcular duración del tratamiento
        -- Se usa EXTRACT para manejar la resta de timestamps que devuelve un intervalo
        duracion_dias := EXTRACT(DAY FROM (COALESCE(tratamiento_rec.fecha_fin, CURRENT_DATE) - tratamiento_rec.fecha_inicio))::INTEGER;

        -- Calcular número de citas basado en la duración del tratamiento
        num_citas := GREATEST(duracion_dias / 7, 1);
        num_citas := LEAST(num_citas, 30); -- Máximo 30 citas
        
        fecha_cita := tratamiento_rec.fecha_inicio;
        
        FOR i IN 1..num_citas LOOP
            user_id := user_ids[1 + floor(random() * array_length(user_ids, 1))::int];
            
            -- Alternar entre citas de medicamentos y revisión
            IF i % 4 = 0 THEN
                tipo_cita_id := tipo_revision_id;
            ELSE
                tipo_cita_id := tipo_medicamentos_id;
            END IF;
            
            -- Determinar estado de la cita
            IF fecha_cita < CURRENT_DATE THEN
                -- Citas pasadas: 85% asistidas, 15% perdidas
                IF random() > 0.15 THEN
                    estado_cita_id := estado_asistido_id;
                    motivo_id := NULL;
                ELSE
                    estado_cita_id := estado_perdido_id;
                    motivo_id := motivo_ids[1 + floor(random() * array_length(motivo_ids, 1))::int];
                END IF;
            ELSE
                -- Citas futuras: programadas
                estado_cita_id := estado_programado_id;
                motivo_id := NULL;
            END IF;
            
            INSERT INTO cita (
                id, fecha_programada, fecha_actual, observaciones,
                "userId", "tratamientoId", "estadoId", "tipoId", id_motivo,
                created_at, updated_at
            )
            VALUES (
                gen_random_uuid(),
                fecha_cita,
                CASE 
                    WHEN fecha_cita < CURRENT_DATE THEN fecha_cita + floor(random() * 3)::INTEGER
                    ELSE fecha_cita
                END,
                CASE 
                    WHEN random() > 0.7 THEN 'Paciente asiste puntualmente'
                    WHEN random() > 0.4 THEN 'Se entrega medicación'
                    ELSE 'Control de rutina'
                END,
                user_id,
                tratamiento_rec.id,
                estado_cita_id,
                tipo_cita_id,
                motivo_id,
                NOW(),
                NOW()
            );
            
            -- Incrementar fecha (citas semanales o quincenales)
            dias_entre_citas := CASE 
                WHEN i < 8 THEN 7  -- Primera fase: semanal
                ELSE 14            -- Segunda fase: quincenal
            END;
            
            fecha_cita := fecha_cita + dias_entre_citas;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Citas creadas exitosamente!';
END $$;

-- ================================================================
-- 7. LABORATORIOS (múltiples análisis por paciente)
-- ================================================================
DO $$
DECLARE
    paciente_rec RECORD;
    tipo_lab_ids UUID[];
    tipo_control_ids UUID[];
    tipo_resultado_ids UUID[];
    num_labs INTEGER;
    i INTEGER;
    fecha_lab DATE;
    tipo_lab_id UUID;
    tipo_control_id UUID;
    resultado_id UUID;
    basilo_id UUID;
    cultivo_id UUID;
    tratamiento_fecha DATE;
BEGIN
    -- Obtener IDs de tipos
    SELECT ARRAY_AGG(id) INTO tipo_lab_ids FROM tipo_laboratorio;
    SELECT ARRAY_AGG(id) INTO tipo_control_ids FROM tipo_control;
    
    SELECT id INTO basilo_id FROM tipo_laboratorio WHERE descripcion = 'Basiloscopia' LIMIT 1;
    SELECT id INTO cultivo_id FROM tipo_laboratorio WHERE descripcion = 'Cultivo' LIMIT 1;
    
    FOR paciente_rec IN 
        SELECT p.id, MIN(t.fecha_inicio) as primera_fecha
        FROM paciente p
        LEFT JOIN tratamiento_tb t ON t."pacienteId" = p.id
        GROUP BY p.id
    LOOP
        -- Entre 3 y 8 análisis de laboratorio por paciente
        num_labs := 3 + floor(random() * 6)::INTEGER;
        
        IF paciente_rec.primera_fecha IS NOT NULL THEN
            fecha_lab := paciente_rec.primera_fecha - INTERVAL '15 days';
        ELSE
            fecha_lab := CURRENT_DATE - (random() * 365)::INTEGER;
        END IF;
        
        FOR i IN 1..num_labs LOOP
            -- Alternar entre basiloscopia y cultivo
            IF i % 2 = 0 THEN
                tipo_lab_id := basilo_id;
                SELECT id INTO resultado_id 
                FROM tipo_resultado 
                WHERE id_tipo_laboratorio = basilo_id 
                ORDER BY random() 
                LIMIT 1;
            ELSE
                tipo_lab_id := cultivo_id;
                SELECT id INTO resultado_id 
                FROM tipo_resultado 
                WHERE id_tipo_laboratorio = cultivo_id 
                ORDER BY random() 
                LIMIT 1;
            END IF;
            
            -- Determinar tipo de control según la fase
            IF i = 1 THEN
                SELECT id INTO tipo_control_id FROM tipo_control WHERE descripcion = 'Test diagnóstico' LIMIT 1;
            ELSIF i < num_labs - 1 THEN
                SELECT id INTO tipo_control_id FROM tipo_control WHERE descripcion = 'Control de seguimiento' LIMIT 1;
            ELSIF i = num_labs - 1 THEN
                SELECT id INTO tipo_control_id FROM tipo_control WHERE descripcion = 'Término de Tratamiento' LIMIT 1;
            ELSE
                SELECT id INTO tipo_control_id FROM tipo_control WHERE descripcion = 'Control post-tratamiento' LIMIT 1;
            END IF;
            
            INSERT INTO laboratorio (
                id, codigo, fecha, observacion,
                id_paciente, id_tipo_control, id_tipo_laboratorio, id_tipo_resultado,
                created_at, updated_at
            )
            VALUES (
                gen_random_uuid(),
                'LAB-' || LPAD((i + floor(random() * 10000)::INTEGER)::TEXT, 8, '0'),
                fecha_lab,
                CASE 
                    WHEN random() > 0.7 THEN 'Muestra en buen estado'
                    WHEN random() > 0.4 THEN 'Análisis de rutina'
                    ELSE 'Control de seguimiento'
                END,
                paciente_rec.id,
                tipo_control_id,
                tipo_lab_id,
                resultado_id,
                NOW(),
                NOW()
            );
            
            -- Incrementar fecha (controles mensuales aproximadamente)
            fecha_lab := fecha_lab + (25 + floor(random() * 10)::INTEGER) * INTERVAL '1 day';
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Análisis de laboratorio creados exitosamente!';
END $$;

-- ================================================================
-- ESTADÍSTICAS FINALES
-- ================================================================
DO $$
DECLARE
    total_pacientes INTEGER;
    total_tratamientos INTEGER;
    total_citas INTEGER;
    total_laboratorios INTEGER;
    total_contactos INTEGER;
    tratamientos_activos INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_pacientes FROM paciente;
    SELECT COUNT(*) INTO total_tratamientos FROM tratamiento_tb;
    SELECT COUNT(*) INTO total_citas FROM cita;
    SELECT COUNT(*) INTO total_laboratorios FROM laboratorio;
    SELECT COUNT(*) INTO total_contactos FROM contacto_paciente;
    SELECT COUNT(*) INTO tratamientos_activos FROM tratamiento_tb t
    INNER JOIN estado_tratamiento e ON t."estadoId" = e.id
    WHERE e.descripcion = 'En Curso';
    
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'POBLACIÓN DE BASE DE DATOS COMPLETADA';
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Total de Pacientes: %', total_pacientes;
    RAISE NOTICE 'Total de Contactos: %', total_contactos;
    RAISE NOTICE 'Total de Tratamientos: %', total_tratamientos;
    RAISE NOTICE 'Tratamientos Activos: %', tratamientos_activos;
    RAISE NOTICE 'Total de Citas: %', total_citas;
    RAISE NOTICE 'Total de Análisis de Laboratorio: %', total_laboratorios;
    RAISE NOTICE '================================================================';
END $$;

-- ================================================================
-- CONSULTAS DE VERIFICACIÓN ÚTILES
-- ================================================================

-- Ver distribución de pacientes por estado de tratamiento
-- SELECT 
--     et.descripcion as estado_tratamiento,
--     COUNT(DISTINCT t."pacienteId") as num_pacientes
-- FROM tratamiento_tb t
-- INNER JOIN estado_tratamiento et ON t."estadoId" = et.id
-- GROUP BY et.descripcion
-- ORDER BY num_pacientes DESC;

-- Ver citas perdidas por motivo
-- SELECT 
--     m.descripcion as motivo,
--     COUNT(*) as cantidad_citas_perdidas
-- FROM cita c
-- INNER JOIN estado_cita ec ON c."estadoId" = ec.id
-- INNER JOIN motivo m ON c.id_motivo = m.id
-- WHERE ec.descripcion = 'Perdido'
-- GROUP BY m.descripcion
-- ORDER BY cantidad_citas_perdidas DESC;

-- Ver distribución de resultados de laboratorio
-- SELECT 
--     tl.descripcion as tipo_laboratorio,
--     tr.descripcion as resultado,
--     COUNT(*) as cantidad
-- FROM laboratorio l
-- INNER JOIN tipo_laboratorio tl ON l.id_tipo_laboratorio = tl.id
-- INNER JOIN tipo_resultado tr ON l.id_tipo_resultado = tr.id
-- GROUP BY tl.descripcion, tr.descripcion
-- ORDER BY tl.descripcion, cantidad DESC;
