import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Direccion } from "./direccion.entity";
import { Zona_Uv } from "./zona_uv.entity";

@Entity()
export class Zona_Mza {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Direccion, (direccion) => direccion.zona)
    direcciones: Direccion[];

    @ManyToOne(() => Zona_Uv, (zona_uv) => zona_uv.zona_mza)
    zona_uv: Zona_Uv;

    @Column({ length: 100 })
    descripcion: string;

    @Column()
    vertices: string;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}