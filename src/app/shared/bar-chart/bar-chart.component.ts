import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, LinearScale, BarElement, BarController, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { MovimientosService } from '../../services/movimientos.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  barChart: any;
  ventasData: any[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(
    private movimientosService: MovimientosService,
  ) {
    Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);
  }

  ngAfterViewInit(): void {
    this.movimientosService.listAllVentasPorCategoria()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {  
        this.ventasData = data;
        this.loadSalesData();
      });
  }

  loadSalesData() {
    if (this.barChart) {
      this.barChart.destroy();  
    }

    const labels = this.ventasData.map((item: { TipoMovimiento: any; }) => item.TipoMovimiento);
    const salesData = this.ventasData.map((item: { cantidad: any; }) => item.cantidad);

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ventas',
          data: salesData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            type: 'category',
            labels: labels
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
