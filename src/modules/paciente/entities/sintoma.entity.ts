import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paciente_Sintoma } from "./paciente_sintoma.entity";


@Entity('sintoma')
export class Sintoma {
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

    @OneToMany(() => Paciente_Sintoma, (ps) => ps.sintoma)
    paciente_sintomas: Paciente_Sintoma[];
}
