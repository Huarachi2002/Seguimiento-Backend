-- ================================================================
-- CONSULTAS ÚTILES PARA REPORTES Y ANÁLISIS
-- ================================================================
-- Este archivo contiene consultas SQL útiles para generar reportes
-- y analizar los datos del sistema de seguimiento TB
-- ================================================================

-- ================================================================
-- 1. ESTADÍSTICAS GENERALES
-- ================================================================

-- Resumen general del sistema
SELECT 
    (SELECT COUNT(*) FROM paciente WHERE estado = true) as total_pacientes_activos,
    (SELECT COUNT(*) FROM "tratamientoTB") as total_tratamientos,
    (SELECT COUNT(*) FROM "tratamientoTB" t 
     INNER JOIN estado_tratamiento et ON t."estadoId" = et.id 
     WHERE et.descripcion = 'En Curso') as tratamientos_activos,
    (SELECT COUNT(*) FROM cita) as total_citas,
    (SELECT COUNT(*) FROM cita c 
     INNER JOIN estado_cita ec ON c."estadoId" = ec.id 
     WHERE ec.descripcion = 'Asistido') as citas_asistidas,
    (SELECT COUNT(*) FROM laboratorio) as total_laboratorios;

-- ================================================================
-- 2. ANÁLISIS DE PACIENTES
-- ================================================================

-- Distribución de pacientes por género
SELECT 
    CASE genero 
        WHEN 0 THEN 'Masculino'
        WHEN 1 THEN 'Femenino'
        ELSE 'Otro'
    END as genero,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM paciente
GROUP BY genero
ORDER BY cantidad DESC;

-- Distribución de pacientes por rango de edad
SELECT 
    CASE 
        WHEN edad < 18 THEN '0-17 años'
        WHEN edad BETWEEN 18 AND 30 THEN '18-30 años'
        WHEN edad BETWEEN 31 AND 50 THEN '31-50 años'
        WHEN edad BETWEEN 51 AND 65 THEN '51-65 años'
        ELSE '66+ años'
    END as rango_edad,
    COUNT(*) as cantidad
FROM (
    SELECT 
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::INTEGER as edad
    FROM paciente
) edades
GROUP BY rango_edad
ORDER BY rango_edad;

-- Pacientes con más contactos
SELECT 
    p.nombre,
    p.numero_doc,
    p.telefono,
    COUNT(cp.id) as num_contactos
FROM paciente p
LEFT JOIN contacto_paciente cp ON cp."pacienteId" = p.id
GROUP BY p.id, p.nombre, p.numero_doc, p.telefono
ORDER BY num_contactos DESC
LIMIT 20;

-- ================================================================
-- 3. ANÁLISIS DE TRATAMIENTOS
-- ================================================================

-- Distribución de tratamientos por tipo
SELECT 
    tt.descripcion as tipo_tratamiento,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM "tratamientoTB" t
INNER JOIN tipo_tratamiento tt ON t."tipoTratamientoId" = tt.id
GROUP BY tt.descripcion
ORDER BY cantidad DESC;

-- Distribución de tratamientos por estado
SELECT 
    et.descripcion as estado,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM "tratamientoTB" t
INNER JOIN estado_tratamiento et ON t."estadoId" = et.id
GROUP BY et.descripcion
ORDER BY cantidad DESC;

-- Distribución de tratamientos por fase
SELECT 
    ft.descripcion as fase,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM "tratamientoTB" t
INNER JOIN fase_tratamiento ft ON t."faseId" = ft.id
GROUP BY ft.descripcion
ORDER BY cantidad DESC;

-- Distribución por localización de TB
SELECT 
    lt.descripcion as localizacion,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM "tratamientoTB" t
INNER JOIN localizacion_tb lt ON t."localizacionId" = lt.id
GROUP BY lt.descripcion
ORDER BY cantidad DESC;

-- Tratamientos activos con información del paciente
SELECT 
    p.nombre,
    p.numero_doc,
    tt.descripcion as tipo,
    ft.descripcion as fase,
    t.fecha_inicio,
    CURRENT_DATE - t.fecha_inicio as dias_transcurridos
FROM "tratamientoTB" t
INNER JOIN paciente p ON t."pacienteId" = p.id
INNER JOIN tipo_tratamiento tt ON t."tipoTratamientoId" = tt.id
INNER JOIN fase_tratamiento ft ON t."faseId" = ft.id
INNER JOIN estado_tratamiento et ON t."estadoId" = et.id
WHERE et.descripcion = 'En Curso'
ORDER BY t.fecha_inicio DESC;

-- Duración promedio de tratamientos completados
SELECT 
    tt.descripcion as tipo_tratamiento,
    COUNT(*) as tratamientos_completados,
    ROUND(AVG(t.fecha_fin - t.fecha_inicio), 0) as dias_promedio,
    MIN(t.fecha_fin - t.fecha_inicio) as dias_minimo,
    MAX(t.fecha_fin - t.fecha_inicio) as dias_maximo
FROM "tratamientoTB" t
INNER JOIN tipo_tratamiento tt ON t."tipoTratamientoId" = tt.id
INNER JOIN estado_tratamiento et ON t."estadoId" = et.id
WHERE t.fecha_fin IS NOT NULL 
  AND et.descripcion IN ('Curado', 'Tratamiento Completo')
GROUP BY tt.descripcion;

-- ================================================================
-- 4. ANÁLISIS DE CITAS
-- ================================================================

-- Tasa de asistencia a citas
SELECT 
    ec.descripcion as estado_cita,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM cita c
INNER JOIN estado_cita ec ON c."estadoId" = ec.id
GROUP BY ec.descripcion
ORDER BY cantidad DESC;

-- Distribución de citas por tipo
SELECT 
    tc.descripcion as tipo_cita,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM cita c
INNER JOIN tipo_cita tc ON c."tipoId" = tc.id
GROUP BY tc.descripcion
ORDER BY cantidad DESC;

-- Motivos de citas perdidas
SELECT 
    m.descripcion as motivo,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cita c2 
                                INNER JOIN estado_cita ec2 ON c2."estadoId" = ec2.id 
                                WHERE ec2.descripcion = 'Perdido') * 100, 2) as porcentaje
FROM cita c
INNER JOIN estado_cita ec ON c."estadoId" = ec.id
INNER JOIN motivo m ON c.id_motivo = m.id
WHERE ec.descripcion = 'Perdido'
GROUP BY m.descripcion
ORDER BY cantidad DESC;

-- Citas por usuario (doctor/licenciado)
SELECT 
    u.nombre,
    r.descripcion as rol,
    COUNT(*) as total_citas,
    SUM(CASE WHEN ec.descripcion = 'Asistido' THEN 1 ELSE 0 END) as citas_asistidas,
    SUM(CASE WHEN ec.descripcion = 'Perdido' THEN 1 ELSE 0 END) as citas_perdidas,
    ROUND(SUM(CASE WHEN ec.descripcion = 'Asistido' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as tasa_asistencia
FROM cita c
INNER JOIN "user" u ON c."userId" = u.id
INNER JOIN rol r ON u."rolId" = r.id
INNER JOIN estado_cita ec ON c."estadoId" = ec.id
GROUP BY u.id, u.nombre, r.descripcion
ORDER BY total_citas DESC;

-- Próximas citas programadas
SELECT 
    p.nombre as paciente,
    p.telefono,
    c.fecha_programada,
    tc.descripcion as tipo_cita,
    u.nombre as responsable
FROM cita c
INNER JOIN "tratamientoTB" t ON c."tratamientoId" = t.id
INNER JOIN paciente p ON t."pacienteId" = p.id
INNER JOIN tipo_cita tc ON c."tipoId" = tc.id
INNER JOIN "user" u ON c."userId" = u.id
INNER JOIN estado_cita ec ON c."estadoId" = ec.id
WHERE ec.descripcion = 'Programado'
  AND c.fecha_programada >= CURRENT_DATE
ORDER BY c.fecha_programada
LIMIT 50;

-- Tendencia de citas por mes
SELECT 
    TO_CHAR(fecha_programada, 'YYYY-MM') as mes,
    COUNT(*) as total_citas,
    SUM(CASE WHEN ec.descripcion = 'Asistido' THEN 1 ELSE 0 END) as asistidas,
    SUM(CASE WHEN ec.descripcion = 'Perdido' THEN 1 ELSE 0 END) as perdidas,
    ROUND(SUM(CASE WHEN ec.descripcion = 'Asistido' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as tasa_asistencia
FROM cita c
INNER JOIN estado_cita ec ON c."estadoId" = ec.id
WHERE c.fecha_programada >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY mes
ORDER BY mes DESC;

-- ================================================================
-- 5. ANÁLISIS DE LABORATORIO
-- ================================================================

-- Distribución de resultados por tipo de laboratorio
SELECT 
    tl.descripcion as tipo_laboratorio,
    tr.descripcion as resultado,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY tl.descripcion), 2) as porcentaje
FROM laboratorio l
INNER JOIN tipo_laboratorio tl ON l.id_tipo_laboratorio = tl.id
INNER JOIN tipo_resultado tr ON l.id_tipo_resultado = tr.id
GROUP BY tl.descripcion, tr.descripcion
ORDER BY tl.descripcion, cantidad DESC;

-- Distribución por tipo de control
SELECT 
    tc.descripcion as tipo_control,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM laboratorio l
INNER JOIN tipo_control tc ON l.id_tipo_control = tc.id
GROUP BY tc.descripcion
ORDER BY cantidad DESC;

-- Evolución de resultados por paciente (últimos 5 resultados)
SELECT 
    p.nombre,
    p.numero_doc,
    l.fecha,
    tl.descripcion as tipo_lab,
    tr.descripcion as resultado,
    tc.descripcion as tipo_control,
    ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY l.fecha DESC) as num_analisis
FROM laboratorio l
INNER JOIN paciente p ON l.id_paciente = p.id
INNER JOIN tipo_laboratorio tl ON l.id_tipo_laboratorio = tl.id
INNER JOIN tipo_resultado tr ON l.id_tipo_resultado = tr.id
INNER JOIN tipo_control tc ON l.id_tipo_control = tc.id
WHERE p.id IN (
    SELECT DISTINCT id_paciente 
    FROM laboratorio 
    ORDER BY random() 
    LIMIT 10
)
ORDER BY p.nombre, l.fecha DESC;

-- Análisis de laboratorios por mes
SELECT 
    TO_CHAR(fecha, 'YYYY-MM') as mes,
    COUNT(*) as total_analisis,
    COUNT(DISTINCT id_paciente) as pacientes_atendidos
FROM laboratorio
WHERE fecha >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY mes
ORDER BY mes DESC;

-- ================================================================
-- 6. ANÁLISIS GEOGRÁFICO
-- ================================================================

-- Distribución de pacientes por zona UV
SELECT 
    zu.descripcion as zona_uv,
    COUNT(DISTINCT p.id) as num_pacientes,
    COUNT(DISTINCT t.id) as num_tratamientos,
    COUNT(DISTINCT CASE WHEN et.descripcion = 'En Curso' THEN t.id END) as tratamientos_activos
FROM zona_uv zu
INNER JOIN zona_mza zm ON zm."zona_uvId" = zu.id
INNER JOIN direccion d ON d."zonaMzaId" = zm.id
INNER JOIN paciente p ON p."direccionId" = d.id
LEFT JOIN "tratamientoTB" t ON t."pacienteId" = p.id
LEFT JOIN estado_tratamiento et ON t."estadoId" = et.id
GROUP BY zu.id, zu.descripcion
ORDER BY num_pacientes DESC;

-- Distribución de pacientes por zona Manzana
SELECT 
    zm.descripcion as zona_manzana,
    zu.descripcion as zona_uv,
    COUNT(DISTINCT p.id) as num_pacientes
FROM zona_mza zm
INNER JOIN zona_uv zu ON zm."zona_uvId" = zu.id
INNER JOIN direccion d ON d."zonaMzaId" = zm.id
INNER JOIN paciente p ON p."direccionId" = d.id
GROUP BY zm.id, zm.descripcion, zu.descripcion
ORDER BY num_pacientes DESC
LIMIT 20;

-- ================================================================
-- 7. ANÁLISIS DE COMORBILIDADES
-- ================================================================

-- Enfermedades más frecuentes en pacientes TB
SELECT 
    e.descripcion as enfermedad,
    COUNT(DISTINCT pe.id_paciente) as num_pacientes,
    ROUND(COUNT(DISTINCT pe.id_paciente) * 100.0 / (SELECT COUNT(*) FROM paciente), 2) as porcentaje_poblacion
FROM enfermedad e
INNER JOIN paciente_enfermedad pe ON pe.id_enfermedad = e.id
GROUP BY e.descripcion
ORDER BY num_pacientes DESC;

-- Síntomas más frecuentes
SELECT 
    s.descripcion as sintoma,
    COUNT(DISTINCT ps.id_paciente) as num_pacientes,
    ROUND(COUNT(DISTINCT ps.id_paciente) * 100.0 / (SELECT COUNT(*) FROM paciente), 2) as porcentaje_poblacion
FROM sintoma s
INNER JOIN paciente_sintoma ps ON ps.id_sintoma = s.id
GROUP BY s.descripcion
ORDER BY num_pacientes DESC;

-- Pacientes con múltiples comorbilidades
SELECT 
    p.nombre,
    p.numero_doc,
    COUNT(pe.id) as num_comorbilidades,
    STRING_AGG(e.descripcion, ', ') as enfermedades
FROM paciente p
INNER JOIN paciente_enfermedad pe ON pe.id_paciente = p.id
INNER JOIN enfermedad e ON pe.id_enfermedad = e.id
GROUP BY p.id, p.nombre, p.numero_doc
HAVING COUNT(pe.id) > 1
ORDER BY num_comorbilidades DESC
LIMIT 20;

-- ================================================================
-- 8. INDICADORES DE RENDIMIENTO (KPIs)
-- ================================================================

-- KPI: Tasa de curación
SELECT 
    COUNT(CASE WHEN et.descripcion = 'Curado' THEN 1 END) as curados,
    COUNT(CASE WHEN et.descripcion IN ('Curado', 'Tratamiento Completo', 'Fracaso', 'Fallecido', 'Abandonada') THEN 1 END) as tratamientos_finalizados,
    ROUND(
        COUNT(CASE WHEN et.descripcion = 'Curado' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(CASE WHEN et.descripcion IN ('Curado', 'Tratamiento Completo', 'Fracaso', 'Fallecido', 'Abandonada') THEN 1 END), 0),
        2
    ) as tasa_curacion_porcentaje
FROM "tratamientoTB" t
INNER JOIN estado_tratamiento et ON t."estadoId" = et.id;

-- KPI: Tasa de abandono
SELECT 
    COUNT(CASE WHEN et.descripcion = 'Abandonada' THEN 1 END) as abandonos,
    COUNT(*) as total_tratamientos,
    ROUND(COUNT(CASE WHEN et.descripcion = 'Abandonada' THEN 1 END) * 100.0 / COUNT(*), 2) as tasa_abandono_porcentaje
FROM "tratamientoTB" t
INNER JOIN estado_tratamiento et ON t."estadoId" = et.id;

-- KPI: Adherencia a citas
SELECT 
    COUNT(CASE WHEN ec.descripcion = 'Asistido' THEN 1 END) as asistidas,
    COUNT(CASE WHEN c.fecha_programada < CURRENT_DATE THEN 1 END) as citas_pasadas,
    ROUND(
        COUNT(CASE WHEN ec.descripcion = 'Asistido' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(CASE WHEN c.fecha_programada < CURRENT_DATE THEN 1 END), 0),
        2
    ) as adherencia_porcentaje
FROM cita c
INNER JOIN estado_cita ec ON c."estadoId" = ec.id;

-- KPI: Promedio de días hasta inicio de tratamiento
SELECT 
    ROUND(AVG(t.fecha_inicio - l.fecha), 0) as dias_promedio_diagnostico_tratamiento
FROM "tratamientoTB" t
INNER JOIN paciente p ON t."pacienteId" = p.id
INNER JOIN (
    SELECT id_paciente, MIN(fecha) as fecha
    FROM laboratorio l2
    INNER JOIN tipo_control tc ON l2.id_tipo_control = tc.id
    WHERE tc.descripcion = 'Test diagnóstico'
    GROUP BY id_paciente
) l ON l.id_paciente = p.id;

-- ================================================================
-- 9. ALERTAS Y SEGUIMIENTO
-- ================================================================

-- Pacientes con citas perdidas consecutivas
SELECT 
    p.nombre,
    p.telefono,
    p.email,
    COUNT(*) as citas_perdidas_consecutivas,
    MAX(c.fecha_programada) as ultima_cita_perdida
FROM cita c
INNER JOIN "tratamientoTB" t ON c."tratamientoId" = t.id
INNER JOIN paciente p ON t."pacienteId" = p.id
INNER JOIN estado_cita ec ON c."estadoId" = ec.id
WHERE ec.descripcion = 'Perdido'
  AND c.fecha_programada >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id, p.nombre, p.telefono, p.email
HAVING COUNT(*) >= 2
ORDER BY citas_perdidas_consecutivas DESC;

-- Tratamientos que necesitan seguimiento cercano
SELECT 
    p.nombre,
    p.telefono,
    ft.descripcion as fase,
    t.fecha_inicio,
    CURRENT_DATE - t.fecha_inicio as dias_tratamiento,
    COUNT(CASE WHEN ec.descripcion = 'Perdido' THEN 1 END) as citas_perdidas
FROM "tratamientoTB" t
INNER JOIN paciente p ON t."pacienteId" = p.id
INNER JOIN fase_tratamiento ft ON t."faseId" = ft.id
INNER JOIN estado_tratamiento et ON t."estadoId" = et.id
LEFT JOIN cita c ON c."tratamientoId" = t.id
LEFT JOIN estado_cita ec ON c."estadoId" = ec.id
WHERE et.descripcion = 'En Curso'
GROUP BY p.id, p.nombre, p.telefono, t.id, ft.descripcion, t.fecha_inicio
HAVING COUNT(CASE WHEN ec.descripcion = 'Perdido' THEN 1 END) >= 2
ORDER BY citas_perdidas DESC, dias_tratamiento DESC;

-- Pacientes sin análisis de laboratorio reciente
SELECT 
    p.nombre,
    p.numero_doc,
    p.telefono,
    MAX(l.fecha) as ultimo_laboratorio,
    CURRENT_DATE - MAX(l.fecha) as dias_sin_laboratorio
FROM paciente p
INNER JOIN "tratamientoTB" t ON t."pacienteId" = p.id
INNER JOIN estado_tratamiento et ON t."estadoId" = et.id
LEFT JOIN laboratorio l ON l.id_paciente = p.id
WHERE et.descripcion = 'En Curso'
GROUP BY p.id, p.nombre, p.numero_doc, p.telefono
HAVING MAX(l.fecha) < CURRENT_DATE - INTERVAL '45 days' 
    OR MAX(l.fecha) IS NULL
ORDER BY dias_sin_laboratorio DESC NULLS FIRST
LIMIT 30;
