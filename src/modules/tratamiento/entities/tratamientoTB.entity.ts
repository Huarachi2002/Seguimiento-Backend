import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tipo_Tratamiento } from "./tipo_tratamiento.entity";
import { Estado_Tratamiento } from "./estado_tratamiento.entity";
import { Paciente } from "../../paciente/entities/paciente.entity";
import { Fase_Tratamiento } from "./fase_tratamiento.entity";
import { Cita } from "./cita.entity";
import { Localizacion_TB } from "./localizacion_tb.entity";


@Entity()
export class TratamientoTB {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Cita, (cita) => cita.tratamiento, { nullable: true })
    citas: Cita[];

    @ManyToOne(() => Paciente, (paciente) => paciente.tratamientos)
    paciente: Paciente; // Input Frontend

    @ManyToOne(() => Tipo_Tratamiento, (tipo_tratamiento) => tipo_tratamiento.tratamientos)
    tipo_tratamiento: Tipo_Tratamiento;  // Input Frontend

    @ManyToOne(() => Estado_Tratamiento, (estado) => estado.tratamientos)
    estado: Estado_Tratamiento; // Input Frontend

    @ManyToOne(() => Fase_Tratamiento, (fase) => fase.tratamientos)
    fase: Fase_Tratamiento; // Input Frontend

    @ManyToOne(() => Localizacion_TB, { nullable: true })
    localizacion: Localizacion_TB;

    @Column()
    fecha_inicio: Date; // Input Frontend

    @Column({ nullable: true })
    fecha_fin: Date;

    @Column()
    observaciones: string;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}