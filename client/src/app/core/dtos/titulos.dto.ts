export interface TituloResponse {
    titulo_num: string;
    status: string;
    tipo: number;
    fecha_expedicion: Date;
    expedidoa2: string;
    message: string
    seguimiento: string;
    fecha_rev: Date;
}
export interface ConteoRegistros {
    Total: number;
    Posteriores_2025: number;
    Anteriores_2025: number;
    Con_Adeudo: number;
  }