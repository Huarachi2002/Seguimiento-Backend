import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contacto_Paciente } from "./contacto.entity";

@Entity()
export class Tipo_Parentesco {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Contacto_Paciente, (contacto) => contacto.tipo_parentesco)
    contactos: Contacto_Paciente[];

    @Column({ length: 100 })
    descripcion: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}