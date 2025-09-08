import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paciente } from "./paciente.entity";
import { Tipo_Parentesco } from "./tipo_parentesco.entity";

@Entity()
export class Contacto_Paciente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Paciente, (paciente) => paciente.contactos)
    paciente: Paciente;

    @ManyToOne(() => Tipo_Parentesco, (tipo) => tipo.contactos)
    tipo_parentesco: Tipo_Parentesco;

    @Column({ length: 100 })
    nombre_contacto: string;

    @Column({ length: 20 })
    numero_telefono_contacto: string;

    @Column()
    direccion: string;

    @Column()
    emergencia: boolean;

    @Column()
    tiene_whatsapp: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}