import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('zonas')
export class Zona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  municipio: string;

  @Column()
  zona: string;
}