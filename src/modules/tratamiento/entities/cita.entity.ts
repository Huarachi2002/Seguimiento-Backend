import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TratamientoTB } from "./tratamientoTB.entity";
import { Tipo_Cita } from "./tipo_cita.entity";
import { Estado_Cita } from "./estado_cita.entity";
import { User } from "./user.entity";
import { Motivo } from "./motivo.entity";


@Entity()
export class Cita {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.citas)
    user: User;

    @ManyToOne(() => TratamientoTB, (tratamiento) => tratamiento.citas)
    tratamiento: TratamientoTB;

    @ManyToOne(() => Estado_Cita, (estado) => estado.citas)
    estado: Estado_Cita;

    @ManyToOne(() => Tipo_Cita, (tipo) => tipo.citas)
    tipo: Tipo_Cita;

    @ManyToOne(() => Motivo, (motivo) => motivo.citas)
    @JoinColumn({name: 'id_motivo'})
    motivo: Motivo;

    @Column()
    fecha_programada: Date;

    @Column()
    fecha_actual: Date;

    @Column()
    observaciones: string;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}