import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Zona_Mza } from "./zona_mza.entity";

@Entity()
export class Zona_Uv {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Zona_Mza, (zona_mza) => zona_mza.zona_uv)
    zona_mza: Zona_Mza[];

    @Column({ length: 100 })
    descripcion: string;

    @Column()
    vertices: string;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}