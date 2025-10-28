import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paciente_Enfermedad } from "./paciente_enfermedad.entity";


@Entity('enfermedad')
export class Enfermedad {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 100 })
    descripcion: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;

    @OneToMany(() => Paciente_Enfermedad, (pe) => pe.enfermedad)
    paciente_enfermedades: Paciente_Enfermedad[];
}
