import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() {}

      formatDateToDDMMYY(date: any): string {
        if (!date) return '';

        const jsDate = new Date(date);  // Convertir el valor en un objeto Date

        // Obtener los componentes de la fecha (día, mes, año)
        const day = jsDate.getUTCDate();      // Obtener el día en UTC
        const month = jsDate.getUTCMonth() + 1; // Los meses en JavaScript son 0 indexados, sumamos 1
        const year = jsDate.getUTCFullYear().toString().slice(-2); // Obtener los dos últimos dígitos del año

        // Devolver en formato dd/MM/yy
        return `${this.padToTwoDigits(day)}/${this.padToTwoDigits(month)}/${year}`;
      }

      // Función auxiliar para asegurarse de que el día/mes tiene dos dígitos
      padToTwoDigits(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
  }
}
