import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TratamientoTB } from "./tratamientoTB.entity";


@Entity()
export class Estado_Tratamiento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => TratamientoTB, (tratamiento) => tratamiento.estado)
    tratamientos: TratamientoTB[];

    @Column({ length: 100 })
    descripcion: string;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}