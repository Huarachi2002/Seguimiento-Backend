import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tipo_Tratamiento } from "./tipo_tratamiento.entity";
import { Estado_Tratamiento } from "./estado_tratamiento.entity";
import { Paciente } from "../../paciente/entities/paciente.entity";
import { Fase_Tratamiento } from "./fase_tratamiento.entity";


@Entity()
export class TratamientoTB {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Paciente, (paciente) => paciente.tratamientos)
    paciente: Paciente; // Input Frontend

    @ManyToOne(() => Tipo_Tratamiento, (tipo_tratamiento) => tipo_tratamiento.id)
    tipo_tratamiento: Tipo_Tratamiento;  // Input Frontend

    @ManyToOne(() => Estado_Tratamiento, (estado) => estado.id)
    estado: Estado_Tratamiento; // Input Frontend

    @ManyToOne(() => Fase_Tratamiento, (fase) => fase.id)
    fase: Fase_Tratamiento; // Input Frontend

    @Column({ length: 100 })
    codigo_tratamiento: string; // Columna al pedo

    @Column()
    fecha_inicio: Date; // Input Frontend

    @Column({ nullable: true })
    fecha_fin: Date;

    @Column({ length: 100 })
    regimen_medicacion: string; // Columna al pedo

    @Column()
    dosis_total: number;  // Columna al pedo

    @Column()
    dosis_completa: number; // Columna al pedo

    @Column()
    observaciones: string;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}