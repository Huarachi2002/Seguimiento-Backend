import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cita } from "./cita.entity";


@Entity()
export class Tipo_Cita {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Cita, (cita) => cita.tipo)
    citas: Cita[];

    @Column({ unique: true, length: 100 })
    descripcion: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}