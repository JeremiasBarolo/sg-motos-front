import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MovimientosService } from '../../../services/movimientos.service';
import { DatePipe } from '@angular/common';
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';

@Component({
  selector: 'app-historial-clientes',
  templateUrl: './historial-clientes.component.html',
  styleUrl: './historial-clientes.component.css',
  providers: [DatePipe]
  
})
export class HistorialClientesComponent implements OnInit, OnDestroy {

  products: any[] = [];
  columns: any[] = [];
  showTable = false;
  showDropdownDialog = false;
  movements: any[] = [];
  clientes: any[] = [];
  selectedClient: any;
  clienteChoice:any[] = []
  selectedDate: any;
  fechasModal: boolean = false
  filteredProducts: any[] = []
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;
  private destroy$ = new Subject<void>();


  constructor( 
    private movimientosService: MovimientosService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ){

  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ngOnInit(): void {
    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'cliente', header: 'Cliente' },
      { field: 'TipoMovimiento', header: 'Tipo Movimiento' },
      { field: 'subtotal', header: 'Monto Final' },
      { field: 'FechaRealizacion', header: 'Fecha Realizacion' },
      { field: 'hora', header: 'Hora' },
      { field: 'usuario', header: 'Recepcionista' },
    ];
    this.loadPage({ page: 0, size: this.pageSize });
  }

  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    const uniqueClientes = new Set<number>();
    this.movimientosService
      .getPageHistorial(event.page, event.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mapped = mapPaginatedResponse(response, (item) => {
            if (!uniqueClientes.has(item.personaId)) {
              uniqueClientes.add(item.personaId);
              this.clienteChoice.push({ id: item.personaId, cliente: item.cliente });
            }
            return {
              id: item.id,
              cliente: item.cliente,
              TipoMovimiento: item.TipoMovimiento,
              subtotal: item.subtotal,
              FechaRealizacion: item.FechaRealizacion,
              hora: item.hora,
              usuario: item.usuario,
              tipoMovimientoId: item.tipoMovimientoId,
              usuarioId: item.usuarioId,
              personaId: item.personaId,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            };
          });
          this.products = mapped.items;
          this.totalRecords = mapped.totalRecords;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }
 

  searchClientMovements() {
    if (this.selectedClient) {
      this.movements = this.products.filter(movement => movement.personaId === this.selectedClient.id);
      this.showTable = true;
    }
  }
  
  showClientDropdown() {
    this.showDropdownDialog = true;
  }

  onClientChange(event: any) {
    this.selectedClient = event.value;
    this.showDropdownDialog = false;
    this.searchClientMovements();
  }
 

  cerrarFecha(){
    this.fechasModal = false
    this.filteredProducts = []
  }

  filterByDate() {
    if (this.selectedDate) {
      const formattedSelectedDate = this.datePipe.transform(this.selectedDate, 'dd/MM/yy');
      this.filteredProducts = this.products.filter(product => {
        const formattedProductDate = this.datePipe.transform(product.createdAt, 'dd/MM/yy');
        return formattedProductDate === formattedSelectedDate;
      });
      console.log(this.filteredProducts);
      
      this.fechasModal = true
    }
  }
  
  

}
