import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { PersonasService } from '../../../services/personas.service';
import { Subject, takeUntil } from 'rxjs';
import { MovimientosService } from '../../../services/movimientos.service';
import { PedidosService } from '../../../services/pedidos.service';
import { StockService } from '../../../services/stock.service';
import { TareasService } from '../../../services/tareas.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  
})
export class InicioComponent implements OnInit, OnDestroy {
  titulo :any
  id: any
  isAdmin: any;
  recaudacionTotal:any
  ventasTotal:any
  pedidosPendientes:any
  stockDisponible:any
  modalData:boolean = false
  empleados:any[] = []
  clientes:any[] = []
  ventasData:any[] = []
  cardData:any
  tareas:any


  private destroy$ = new Subject<void>();
  isloggedIn: boolean = false
 

  constructor(
    private authService: AuthService,
    private personasService: PersonasService,
    private movimientosService: MovimientosService,
    private pedidosService: PedidosService,
    private stockService: StockService,
    private tareasService: TareasService,
    
  ) {
    
  }
  ngOnInit(): void {
    this.isloggedIn = this.authService.isLoggedIn()
   
    this.isAdmin = this.authService.isAllowed();
    this.authService.getUserData().subscribe((data: any) => {
      if(data.nombre === 'Admin Admin'){
        this.titulo = 'Admin';
        
      }else{
        this.titulo = data.nombre;
      }
     this.id = data.userId
      
    })
    
    

    if(this.isAdmin){

      this.personasService.getMejoresEmpleados()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.empleados = data.sort((a, b) => b.ventas - a.ventas).slice(0, 10);
    });

    this.personasService.getMejoresClientes()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.clientes = data.sort((a, b) => b.ventas - a.ventas).slice(0, 10);
    });

    this.movimientosService.getAllRecaudacion()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      
      
      this.recaudacionTotal = data.recaudacion
      this.ventasTotal = data.cantidad
    });

    

    this.pedidosService.getAllPendientes()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.pedidosPendientes = data
    });

    this.tareasService.getPendientesCount()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.tareas = data
    });



    }else{
  
      
      

      this.tareasService.getTareasEmpleado(this.id).pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.tareas = this.ordenarTareasPorColor(data);
        
      });
    }
    

    

 

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  modalOpen(data:any){
    this.cardData = data;
    this.modalData = true

  }

  ordenarTareasPorColor(tareas:any) {
    return tareas.sort((a: { color: string; }, b: { color: string; }) => {
      const coloresOrden = ['rojo', 'amarillo', 'verde']; 
      return coloresOrden.indexOf(a.color) - coloresOrden.indexOf(b.color);
    });
  }

  
}
