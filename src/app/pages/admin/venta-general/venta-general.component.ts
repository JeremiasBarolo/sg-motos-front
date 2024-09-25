import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PersonasService } from '../../../services/personas.service';
import { StockService } from '../../../services/stock.service';
import { MovimientosService } from '../../../services/movimientos.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-venta-general',
  templateUrl: './venta-general.component.html',
  styleUrl: './venta-general.component.css',
  providers: [DatePipe]
})
export class VentaGeneralComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject<void>();
  tipoMovimientoId: any
  products: any[] = [];
  columns: any[] = [];
  selectedDate!: Date;
  filteredProducts: any[] = []
  empleadoChoice: any[] = []
  selectedClient: any
  editVisible: boolean = false;
  editEliminar: boolean = false;
  crearVisible: boolean = false;
  cantidadVisible: boolean = false;
  detailModal: boolean = false
  fechasModal: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  proveedores: any[] = [];
  tipoArticulos: any[] = [];
  usuarios: any[] = [];
  clientes: any[] = [];
  usuarioId: any
  usuarioIdEdit: any
  options: any[] = [];
  selectedEntities: any[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private personasService: PersonasService,
    private stockService: StockService,
    private movimientosService: MovimientosService,
    private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.form = this.fb.group({
      personaId: ['', Validators.required],
      productos: this.fb.array([])
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.resetComponentState();
    });
  }

  resetComponentState() {
    this.products = [];
    this.empleadoChoice = [];
    this.selectedEntities = [];
    this.options = [];
    this.filteredProducts = [];
    this.cardData = null;
    this.id = 0;
    this.form.reset();
  }

  ngOnInit(): void {
    
    this.aRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const tipo = params.get('tipo'); 
      if (tipo === 'accesorios') {
        this.tipoMovimientoId = 5; 
        this.stockService.getAllStockVentaAccesorios().pipe(takeUntil(this.destroy$)).subscribe(data => this.handleDataOptions(data));
        this.movimientosService.getAllVentasAccesorios().pipe(takeUntil(this.destroy$)).subscribe(data => this.handleDataList(data));
      } else {
        this.tipoMovimientoId = 3;
        this.stockService.getAllStockVentaRespuestos().pipe(takeUntil(this.destroy$)).subscribe(data => this.handleDataOptions(data));
        this.movimientosService.getAllVentasRespuestos().pipe(takeUntil(this.destroy$)).subscribe(data => this.handleDataList(data));
      }
      
    });
    this.authService.getUserData().subscribe((data: any) => {
      this.usuarioId = data.userId
    })
    this.personasService.getAllClientes().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.clientes = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDataList(data: any[]) {
    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'createdAt', header: 'Fecha de Realizacion' },
      { field: 'cliente', header: 'Cliente' },
      { field: 'usuario', header: 'Recepcionista' },
      { field: 'subtotal', header: 'Subtotal' },
      { field: 'cantArt', header: 'Articulos Vendidos' }
    ];

    let dataReal = data.sort((a, b) => b.id - a.id)
    const uniqueEmpledos = new Set();
    console.log(dataReal);
    
    dataReal.forEach((item) => {
      this.products.push({
        id: item.id,
        createdAt: this.datePipe.transform(item.createdAt, 'dd/MM/yy'),
        fecha_realizacion:new Date(item.createdAt),
        cliente: item.cliente,
        usuario: item.usuario,
        subtotal: item.subtotal,
        usuarioId: item.usuarioId,
        personaId: item.personaId,
        stock: item.stock,
        cantArt:  item.stock.reduce((total: any, item: { cantidad: any; }) => total + item.cantidad, 0),
        tipoMovimientoId: item.tipoMovimientoId
      });

      if (!uniqueEmpledos.has(item.personaId)) {
        uniqueEmpledos.add(item.personaId);
        this.empleadoChoice.push({ id: item.personaId, cliente: item.cliente });
      }
    });
  }

  handleDataOptions(data:any[]){
    let dataReal = data.map((stock)=>{
      return {
        ...stock,
        nombre: stock.nombre_articulo,
        cantidad: stock.cantidadActual,
        cantidadActual: stock.cantidadActual
      }
    })

    this.options = dataReal.filter(item => item.cantidadActual > 0 )
  }

  

  onSubmit() {
    const formValue = this.form.value;

    if (!formValue.personaId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar al menos un cliente' });
    } else if (this.selectedEntities.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar al menos un elemento' });
    } else {
      this.tipo = {
        usuarioId: this.id > 0 ? this.usuarioIdEdit : this.usuarioId,
        personaId: formValue.personaId,
        productos: this.selectedEntities,
        tipoMovimientoId: this.tipoMovimientoId
      };

      if (this.id > 0) {
        this.movimientosService.updateVentaRepuestos(this.id, this.tipo) 
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Venta actualizada correctamente' });
            setTimeout(() => {
              window.location.reload();
            }, 600);
          }, (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la venta' });
          });
      } else {
        this.movimientosService.create(this.tipo) 
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Venta creada correctamente' });
            setTimeout(() => {
              window.location.reload();
            }, 600);
          }, (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la venta' });
          });
      }
    }
  }

  Eliminar() {
    this.movimientosService.deleteVentaRepuesto(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Venta eliminada correctamente' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  editarItem(data: any) {
    this.editVisible = true;
    this.id = data.id;
    this.usuarioIdEdit = data.usuarioId;
    console.log('data', data);
    
  
    
    this.form.patchValue({
      personaId: data.personaId
    });
  
    
    if (this.tipoMovimientoId === 3) { 
      this.stockService.getAllStockVentaRespuestos().subscribe(opciones => {
        this.options = opciones.filter(item => item.tipoArticulo !== 'Insumo');
        console.log('opciones',opciones);
        
        data.stock.forEach((item: any) => {
          this.selectedEntities.push(item);
          console.log(item);
          
          this.options = this.options.filter(option => option.id !== item.id);
          this.options = this.options.map((stock) => ({
            ...stock,
            nombre: stock.nombre_articulo,
            cantidad: 1,
            cantidadActual: stock.cantidadActual
          }));
        });
      });
    } else if (this.tipoMovimientoId === 5) { 
      this.stockService.getAllStockVentaAccesorios().subscribe(opciones => {
        this.options = opciones.filter(item => item.tipoArticulo !== 'Insumo');
        
        data.stock.forEach((item: any) => {
          this.selectedEntities.push(item);
          this.options = this.options.filter(option => option.id !== item.id);
          this.options = this.options.map((stock) => ({
            ...stock,
            nombre: stock.nombre_articulo,
            cantidad: 1,
            cantidadActual: stock.cantidad
          }));
        });
      });
    }
  }


  

  // <================================ FUNCIONAMIENTO DE PICKLIST =======================================>

    selectedEntity(entity: any) {
      
      
      this.selectedEntities.push({...entity, cantidad: 1});
      this.options = this.options.filter(item => item.id !== entity.id);
    }

    filterByDate() {
      if (this.selectedDate) {
        const formattedSelectedDate = this.datePipe.transform(this.selectedDate, 'dd/MM/yy');
        this.filteredProducts = this.products.filter(product => {
          const formattedProductDate = product.createdAt
          return formattedProductDate === formattedSelectedDate;
        });

        this.fechasModal = true
      }
    }

    returnEntities(entity: any) {

      this.options.push(entity);
      this.selectedEntities = this.selectedEntities.filter(item => item.id !== entity.id);
    }

    incrementQuantity(item: any): void {
      if (item.cantidad) {
        if (item.cantidad < item.cantidadActual) {
          item.cantidad++;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No hay suficiente stock disponible' });
        }
      } else {
        item.cantidad = 1;
      }
    }

    decrementQuantity(item: any): void {
      if (item.cantidad && item.cantidad > 0) {
        item.cantidad--;
      }
    }


    modalOpen(data:any){
      console.log(data);
      
      this.detailModal = true
      this.cardData = data
    }

    openCrearVentaDialog(): void {
      this.crearVisible = true;
    }

    cantidadesModal(){
      this.crearVisible = false;
      const formValue = this.form.value;

      this.tipo = {
        usuarioId: formValue.usuarioId,
        personaId: formValue.personaId,
      };

    }

    eliminarItem(data: any) {
      this.editEliminar = true;
      this.id = data.id;
    }

    cerrarFecha(){
      this.fechasModal = false
      this.filteredProducts = []
    }

    searchClientMovements() {
      
      this.filteredProducts = this.products.filter(movement => movement.personaId === this.selectedClient.id);
      this.fechasModal = true;

    }



    onClientChange(event: any) {
      this.selectedClient = event.value;
      this.searchClientMovements();
    }

    calcularCantidadArticulos(){

    }
}