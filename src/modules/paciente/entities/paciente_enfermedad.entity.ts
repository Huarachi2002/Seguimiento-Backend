import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paciente } from "./paciente.entity";
import { Enfermedad } from "./enfermedad.entity";

@Entity('paciente_enfermedad')
export class Paciente_Enfermedad {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Paciente, (paciente) => paciente.id)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @ManyToOne(() => Enfermedad, (enfermedad) => enfermedad.paciente_enfermedades)
    @JoinColumn({ name: 'id_enfermedad' })
    enfermedad: Enfermedad;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}
