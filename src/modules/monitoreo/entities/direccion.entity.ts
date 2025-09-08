import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Paciente } from "../../paciente/entities/paciente.entity";
import { Zona_Mza } from "./zona_mza.entity";

@Entity()
export class Direccion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Zona_Mza, (zona) => zona.direcciones)
    zona: Zona_Mza;

    @OneToOne(() => Paciente)
    @JoinColumn()
    paciente: Paciente;

    @Column({ length: 100 })
    descripcion: string;

    @Column()
    nro_casa: number;

    @Column()
    latitud: number;

    @Column()
    longitud: number;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}