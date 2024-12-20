import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('municipios')
export class MunicipioCat {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  clave_mun: string;

  @Column()
  municipio: string;

  @Column()
  completo: string;
}