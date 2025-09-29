import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Rol } from "./rol.entity";
import { Cita } from "./cita.entity";


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Rol, (rol) => rol.users)
    rol: Rol;

    @OneToMany(() => Cita, (cita) => cita.user)
    citas: Cita[];

    @Column()
    username: string;

    @Column()
    contrasena: string;

    @Column()
    nombre: string;

    @Column()
    fecha_login: Date;

    @Column({ default: true })
    estado: boolean;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}