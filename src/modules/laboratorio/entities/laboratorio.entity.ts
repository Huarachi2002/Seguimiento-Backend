import { Column, CreateDateColumn, Double, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paciente } from "../../paciente/entities/paciente.entity";
import { Tipo_Control } from "./tipo_control.entity";
import { Tipo_Laboratorio } from "./tipo_laboratorio.entity";
import { Tipo_Resultado } from "./tipo_resultado.entity";

@Entity()
export class Laboratorio {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ length: 20 })
    codigo: string;

    @Column()
    fecha: Date;

    @Column()
    observacion: string;
    
    @ManyToOne(() => Paciente, (paciente)=> paciente.laboratorios)
    @JoinColumn({name: 'id_paciente'})
    paciente: Paciente;

    @ManyToOne(() => Tipo_Control, (tipo_control)=> tipo_control.laboratorios)
    @JoinColumn({name: 'id_tipo_control'})
    tipo_control: Tipo_Control;

    @ManyToOne(() => Tipo_Laboratorio, (tipo_laboratorio)=> tipo_laboratorio.laboratorios)
    @JoinColumn({name: 'id_tipo_laboratorio'})
    tipo_laboratorio: Tipo_Laboratorio;

    @ManyToOne(() => Tipo_Resultado, (tipo_resultado)=> tipo_resultado.laboratorios)
    @JoinColumn({name: 'id_tipo_resultado'})
    tipo_resultado: Tipo_Resultado;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}