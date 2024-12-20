import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Connection } from 'typeorm';
import { Municipio } from './municipio.entity';

@Entity('marcas')
export class Titulo_num {
  @PrimaryColumn()
  titulo_num: number; // Corresponde al campo 'titulo_num' en la tabla

  @Column()
  fecha_expedicion: Date;

  @Column()
  status: string;

  @Column()
  tipo: string;

  @Column()
  expedidoa2: string;

  @ManyToOne(() => Municipio, (municipios) => municipios)
  @JoinColumn({ name: 'municipio' })  
  municipio: Municipio;  


  @Column()
  asiento_produccion: string;
}


