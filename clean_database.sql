-- ================================================================
-- SCRIPT DE LIMPIEZA DE DATOS DE PRUEBA
-- ================================================================
-- Este script elimina todos los datos de prueba generados
-- manteniendo los datos de los seeders (catálogos base)
-- ================================================================

-- ⚠️ ADVERTENCIA: Este script eliminará todos los datos de prueba
-- Ejecutar solo si estás seguro de querer limpiar la base de datos

BEGIN;

DO $$
BEGIN
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'INICIANDO LIMPIEZA DE DATOS DE PRUEBA';
    RAISE NOTICE '================================================================';
    
    -- 1. Eliminar citas
    DELETE FROM cita;
    RAISE NOTICE '✓ Citas eliminadas';
    
    -- 2. Eliminar laboratorios
    DELETE FROM laboratorio;
    RAISE NOTICE '✓ Laboratorios eliminados';
    
    -- 3. Eliminar relaciones paciente-sintoma
    DELETE FROM paciente_sintoma;
    RAISE NOTICE '✓ Relaciones paciente-síntoma eliminadas';
    
    -- 4. Eliminar relaciones paciente-enfermedad
    DELETE FROM paciente_enfermedad;
    RAISE NOTICE '✓ Relaciones paciente-enfermedad eliminadas';
    
    -- 5. Eliminar tratamientos
    DELETE FROM tratamiento_tb;
    RAISE NOTICE '✓ Tratamientos eliminados';
    
    -- 6. Eliminar contactos
    DELETE FROM contacto_paciente;
    RAISE NOTICE '✓ Contactos eliminados';
    
    -- 7. Eliminar pacientes
    DELETE FROM paciente;
    RAISE NOTICE '✓ Pacientes eliminados';
    
    -- 8. Eliminar direcciones
    DELETE FROM direccion;
    RAISE NOTICE '✓ Direcciones eliminadas';
    
    -- 9. Eliminar usuarios adicionales (mantener solo admin)
    DELETE FROM "user" WHERE username != 'admin';
    RAISE NOTICE '✓ Usuarios adicionales eliminados (admin preservado)';
    
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'LIMPIEZA COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Los datos de catálogos (seeders) se han preservado';
    RAISE NOTICE 'Puede ejecutar el script de población nuevamente';
    RAISE NOTICE '================================================================';
END $$;

-- Reiniciar secuencias si es necesario
-- ALTER SEQUENCE IF EXISTS paciente_id_seq RESTART WITH 1;

COMMIT;

-- Verificar tablas vacías
SELECT 
    'paciente' as tabla, COUNT(*) as registros FROM paciente
UNION ALL
SELECT 'tratamiento_tb', COUNT(*) FROM "tratamiento_tb"
UNION ALL
SELECT 'cit a', COUNT(*) FROM cita
UNION ALL
SELECT 'laboratorio', COUNT(*) FROM laboratorio
UNION ALL
SELECT 'contacto_paciente', COUNT(*) FROM contacto_paciente
UNION ALL
SELECT 'direccion', COUNT(*) FROM direccion
UNION ALL
SELECT 'user', COUNT(*) FROM "user";
