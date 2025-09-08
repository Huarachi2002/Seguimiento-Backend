import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paciente } from "./paciente.entity";


@Entity()
export class Telefono {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Paciente, (paciente) => paciente.telefono)
    paciente: Paciente;

    @Column({ length: 100 })
    telefono: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}