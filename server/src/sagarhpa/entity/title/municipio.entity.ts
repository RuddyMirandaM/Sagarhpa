import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('municipios')
export class Municipio {
  @PrimaryGeneratedColumn()
  Id: number;



  @Column()
  municipio: string;

}