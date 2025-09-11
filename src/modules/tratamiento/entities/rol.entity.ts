import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Rol {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => User, (user) => user.rol)
    users: User[];

    @Column({ unique: true, length: 100 })
    descripcion: string;

    @CreateDateColumn()
    readonly created_at: Date;

    @UpdateDateColumn()
    readonly updated_at: Date;
}