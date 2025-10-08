import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cita } from "./cita.entity";


@Entity('motivo')
export class Motivo {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true, length: 100 })
    descripcion: string;

    @Column({ default:  true})
    estado: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;

    @OneToMany( () => Cita, (cita) => cita.motivo)
    citas: Cita[];
}