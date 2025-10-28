import { Column, CreateDateColumn, Double, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Laboratorio } from "./laboratorio.entity";
import { Tipo_Resultado } from "./tipo_resultado.entity";

@Entity()
export class Tipo_Laboratorio {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ length: 100 })
    descripcion: string;

    @OneToMany(() => Laboratorio, (laboratorio) => laboratorio.tipo_laboratorio)
    laboratorios: Laboratorio[];

    @OneToMany(() => Tipo_Resultado, (tipo_resultado) => tipo_resultado.tipo_laboratorio)
    tipo_resultado: Tipo_Resultado[];

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}