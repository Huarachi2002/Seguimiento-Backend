import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paciente } from "./paciente.entity";
import { Sintoma } from "./sintoma.entity";

@Entity('paciente_sintoma')
export class Paciente_Sintoma {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Paciente, (paciente) => paciente.id)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @ManyToOne(() => Sintoma, (sintoma) => sintoma.paciente_sintomas)
    @JoinColumn({ name: 'id_sintoma' })
    sintoma: Sintoma;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}
