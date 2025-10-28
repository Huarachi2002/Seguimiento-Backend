import { Column, CreateDateColumn, Double, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Laboratorio } from "./laboratorio.entity";
import { Tipo_Laboratorio } from "./tipo_laboratorio.entity";

@Entity()
export class Tipo_Resultado {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ length: 100 })
    descripcion: string;

    @OneToMany(() => Laboratorio, (laboratorio) => laboratorio.tipo_resultado)
    laboratorios: Laboratorio[];

    @ManyToOne(() => Tipo_Laboratorio, (tipo_laboratorio)=> tipo_laboratorio.tipo_resultado)
    @JoinColumn({name: 'id_tipo_laboratorio'})
    tipo_laboratorio: Tipo_Resultado;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}