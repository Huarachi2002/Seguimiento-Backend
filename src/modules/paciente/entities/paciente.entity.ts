import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contacto_Paciente } from "./contacto.entity";

@Entity()
export class Paciente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Contacto_Paciente, (contacto) => contacto.paciente)
    contactos: Contacto_Paciente[];

    @Column({ length: 100 })
    nombre: string;

    @Column({ length: 20, unique: true })
    numero_doc: string;

    @Column()
    tipo_doc: number;

    @Column()
    fecha_nacimiento: string;

    @Column()
    genero: number;

    @Column({ length: 100 })
    email: string;

    @Column()
    tiene_whatsapp: boolean;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}