import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tipo_Tratamiento } from "./tipo_tratamiento.entity";


@Entity()
export class TratamientoTB {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Tipo_Tratamiento, (tipo_tratamiento) => tipo_tratamiento.id)
    tipo_tratamientos: Tipo_Tratamiento[];

    @Column({ length: 100 })
    codigo_tratamiento: string;

    @Column()
    fecha_inicio: Date;

    @Column()
    fecha_fin: Date;

    @Column({ length: 100 })
    regimen_medicacion: string;

    @Column()
    dosis_total: number;

    @Column()
    dosis_completa: number;

    @Column()
    estado: number;

    @Column()
    observaciones: string;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}