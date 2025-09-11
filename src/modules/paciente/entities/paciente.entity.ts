import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contacto_Paciente } from "./contacto.entity";
import { TratamientoTB } from "src/modules/tratamiento/entities/tratamientoTB.entity";

@Entity()
export class Paciente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Contacto_Paciente, (contacto) => contacto.paciente)
    contactos: Contacto_Paciente[];

    @Column({  unique: true })
    telefono: number;

    @OneToMany(() => TratamientoTB, (tratamiento) => tratamiento.paciente)
    tratamientos: TratamientoTB[];

    @Column({ length: 100 })
    nombre: string;

    @Column({ length: 20, unique: true })
    numero_doc: string;

    @Column()
    tipo_doc: number;

    @Column()
    fecha_nacimiento: Date;

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