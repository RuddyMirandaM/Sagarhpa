import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TitulosService } from '../../core/services/titulos.service';
import { CommonModule } from '@angular/common';
import { animales, ConteoRegistros } from '../../core/dtos';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule
  ],
})
export class DashboardComponent {
  conteoAnimal = signal<animales | null>(null);
  conteoRegistros = signal<ConteoRegistros | null>(null);
  error = signal<string>('');
  loading = signal<boolean>(false);

  constructor(private conteoService: TitulosService) {
    this.cargarConteo();
    this.cargarConteotitulos();
  }

  async cargarConteo(): Promise<void> {
    try {
      this.loading.set(true);
      const datos = await this.conteoService.contarAnimales();
      this.conteoAnimal.set(datos[0]);
      console.log('Datos cargados:', this.conteoAnimal());
    } catch (err: any) {
      this.error.set('Error al cargar los datos: ' + (err.message || 'Error desconocido'));
      console.error('Error:', err);
    } finally {
      this.loading.set(false);
    }
  }


  calcularPorcentaje(valor: number, total: number): string {
    if (!total) return '0.00';
    // Calculamos el porcentaje con más precisión
    const porcentaje = (valor / total) * 100;
    // Retornamos el número con 2 decimales fijos
    return porcentaje.toFixed(2);
  }


  async cargarConteotitulos(): Promise<void> {
    try {
      this.loading.set(true);
      const datos = await this.conteoService.contarRegistros();
      this.conteoRegistros.set(datos);
    } catch (err: any) {
      this.error.set('Error al cargar los datos: ' + (err.message || 'Error desconocido'));
      console.error('Error:', err);
    } finally {
      this.loading.set(false);
    }
  }
}
