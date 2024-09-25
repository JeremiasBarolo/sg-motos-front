import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MovimientosService } from '../../../services/movimientos.service';
import { DatePipe } from '@angular/common';

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
  private destroy$ = new Subject<void>();
  filteredProducts: any[] = []


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

    const uniqueEmpledos = new Set();

    this.movimientosService.getAllHistorial().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'cliente', header: 'Cliente' },
        { field: 'TipoMovimiento', header: 'Tipo Movimiento' },
        { field: 'subtotal', header: 'Monto Final' },
        { field: 'FechaRealizacion', header: 'Fecha Realizacion' },
        { field: 'hora', header: 'Hora' },
        { field: 'usuario', header: 'Recepcionista' },
      ];

      let dataSorted = data.sort((a, b) => b.id - a.id)
      dataSorted.map((item)=>{
        this.products.push({
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
        })

         if (!uniqueEmpledos.has(item.personaId)) {
          uniqueEmpledos.add(item.personaId);
          this.clienteChoice.push({ id: item.personaId, cliente: item.cliente });
        }
      })
    })

   
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
