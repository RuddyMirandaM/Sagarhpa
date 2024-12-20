import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('agl')
export class Agl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agl: string;
}