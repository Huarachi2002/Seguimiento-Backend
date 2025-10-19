import { Column, CreateDateColumn, Double, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Laboratorio } from "./laboratorio.entity";

@Entity()
export class Tipo_Control {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ length: 100 })
    descripcion: string;

    @OneToMany(() => Laboratorio, (laboratorio) => laboratorio.tipo_control)
    laboratorios: Laboratorio[];

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}