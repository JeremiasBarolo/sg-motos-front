import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DatosServicioService } from '../../../services/datos-servicio.service';
import { PersonasService } from '../../../services/personas.service';
import { StockService } from '../../../services/stock.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { MovimientosService } from '../../../services/movimientos.service';
import { TipoServicioService } from '../../../services/tipo-servicio.service';
import { ChecklistService } from '../../../services/checklist.service';
import { AuthService } from '../../../services/auth.service';
import { DateFormatterService } from '../../../services/date-formatter.service';

@Component({
  selector: 'app-datos-servicio',
  templateUrl: './datos-servicio.component.html',
  styleUrls: ['./datos-servicio.component.css'],
  providers: [DatePipe]
})
export class DatosServicioComponent implements OnInit, OnDestroy {
  form: FormGroup;
  empleados: any[] = [];
  servicios: any[] = [];
  clientes: any[] = [];
  usuarios: any[] = [];
  tipoServicio: any[] = [];
  checklistOptions: any[] = [];
  columns: any[] = [];
  products: any[] = [];
  showModal: boolean = false;
  cardData: any;
  id: number = 0;
  editVisible: boolean = false;
  datosServicioVisible: boolean = false;
  editEliminar: boolean = false;
  crearVisible: boolean = false;
  serviciosVisible: boolean = false;
  ServiciosStatic: any[] = [];
  tipo:any
  private destroy$ = new Subject<void>();
  selectedServicios: any;
  usuarioId:any
  usuarioIdEdit:any
  recepcionistaId:any
  recepcionistaIdEdit:any
  selectedDate: any;
  fechasModal: boolean = false
  filteredProducts: any[] = []

  constructor(
    private datosServicioService: DatosServicioService,
    private movimientosService: MovimientosService,
    private personasService: PersonasService,
    private usuariosService: UsuariosService,
    private stockService: StockService,
    private tipoServicioService: TipoServicioService,
    private checklistService: ChecklistService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private dateFormatterService: DateFormatterService
    
  ) {
    this.form = this.fb.group({
      modelo: ['', Validators.required],
      num_motor: ['', Validators.required],
      patente: ['', Validators.required],
      color: ['', Validators.required],
      tipo_servicio: ['', Validators.required],
      kilometros: ['', Validators.required],
      estado_general: ['', Validators.required],
      observaciones: ['', Validators.required],
      recepcionistaId: ['', Validators.required],
      hora_est_entrega: ['', Validators.required],
      fecha_est_entrega: ['', Validators.required],
      fecha_recepcion: ['', Validators.required],
      num_chasis: ['', Validators.required],
      personaId: ['', Validators.required],
      selectedServicios: [[]],
      checklist: this.fb.array([]),
      productos: this.fb.array([])
    });
  }

  ngOnInit(): void {

    this.authService.getUserData().subscribe((data: any) => {
      this.usuarioId = data.userId
      this.recepcionistaId = data.personaId
    })


    this.movimientosService.getAllServices().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'modelo', header: 'Modelo' },
        { field: 'patente', header: 'Patente' },
        { field: 'cliente', header: 'Cliente' },
        { field: 'tipo_servicio', header: 'Tipo de Servicio' },
        { field: 'Recepcionista', header: 'Recepcionista' },
        { field: 'fecha_recepcion', header: 'Fecha de Recepcion' },
        { field: 'fecha_est_entrega', header: 'Fecha Estimada de Entrega' },
        { field: 'hora_est_entrega', header: 'Hora Estimada de Entrega' }
      ];

      this.products = data.map((item) => ({
        id: item.id,
        personaId: item.personaId,
        usuarioId: item.usuarioId,
        cliente: item.cliente,
        modelo: item.DatosServicio.modelo,
        num_motor: item.DatosServicio.num_motor,
        num_chasis: item.DatosServicio.num_chasis,
        patente: item.DatosServicio.patente,
        color: item.DatosServicio.color,
        tipo_servicio: item.TipoServicio,
        tipoServicioId: item.tipoServicioId,
        kilometros: item.DatosServicio.kilometros,
        estado_general: item.DatosServicio.estado_general,
        observaciones: item.DatosServicio.observaciones,
        Recepcionista: item.Recepcionista,
        fecha_recepcion: this.dateFormatterService.formatDateToDDMMYY(item.DatosServicio.fecha_recepcion),
        fecha_est_entrega: this.dateFormatterService.formatDateToDDMMYY(item.DatosServicio.fecha_est_entrega),
        hora_est_entrega: item.DatosServicio.hora_est_entrega,
        recepcionistaId: item.DatosServicio.recepcionistaId,
        DatosServicio: item.DatosServicio,
        datosServicioId: item.datosServicioId,
        Servicios: item.Servicios,
        subtotal: item.subtotal,
        checklist: item.checklist
      }));
    });

    this.personasService.getAllEmpleados().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.empleados = data;
    })

    this.stockService.getAllServicios().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.servicios = data;
      this.ServiciosStatic = data;
    })

    this.usuariosService.getAll().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.usuarios = data;
    });

    this.personasService.getAllClientes().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.clientes = data;
    })

    this.tipoServicioService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.tipoServicio = data;
    })

    this.loadChecklistOptions();
   
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get checklist(): FormArray {
    return this.form.get('checklist') as FormArray;
  }

  loadChecklistOptions() {
    this.checklistService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.checklistOptions = data.map((item: any) => ({
        label: item.descripcion,
        value: item.id
      }));

      
    });
  }

  editarItem(data: any) {
    this.editVisible = true;
    this.id = data.id;
    console.log(data);
    this.usuarioIdEdit = data.usuarioId
    this.recepcionistaIdEdit = data.recepcionistaId
    

    const fecha_est_entrega = new Date(data.DatosServicio.fecha_est_entrega).toISOString().split('T')[0];
    const fecha_recepcion = new Date(data.DatosServicio.fecha_recepcion).toISOString().split('T')[0];
    const hora_est_entrega = data.hora_est_entrega.slice(0, 5);

    this.form.patchValue({
      personaId: data.personaId,
      modelo: data.DatosServicio.modelo,
      patente: data.DatosServicio.patente,
      color: data.DatosServicio.color,
      num_motor: data.DatosServicio.num_motor,
      num_chasis: data.DatosServicio.num_chasis,
      tipo_servicio: data.DatosServicio.tipo_servicio,
      kilometros: data.DatosServicio.kilometros,
      estado_general: data.DatosServicio.estado_general,
      observaciones: data.DatosServicio.observaciones,
      hora_est_entrega: hora_est_entrega,
      fecha_est_entrega: fecha_est_entrega,
      fecha_recepcion: fecha_recepcion,
      selectedServicios: data.checklist.map((item: any) =>( {
            value: item.id,
            label: item.nombre
          }))
    });

    this.productos.clear(); 
    data.Servicios.forEach((item: any) => {
      this.agregarProducto({
        id: item.id,
        nombre_articulo: item.nombre,
        costo: item.costo,
        tipoArticulo: item.tipo_articulo
      });
    });

    this.servicios = this.ServiciosStatic.filter(servicio => !data.Servicios.some((item: any) => item.id === servicio.id));
    
    

    
  }

  eliminarItem(data: any) {
    this.editEliminar = true;
    this.id = data.id;
  }

  

  onSubmit() {
    const formData = this.form.value;

    this.tipo = {
      personaId: formData.personaId,
      modelo: formData.modelo,
      color: formData.color,
      patente: formData.patente,
      num_motor: formData.num_motor,
      num_chasis: formData.num_chasis,
      tipo_servicio: formData.tipo_servicio,
      kilometros: formData.kilometros,
      estado_general: formData.estado_general,
      observaciones: formData.observaciones,
      recepcionistaId: formData.recepcionistaId,
      hora_est_entrega: formData.hora_est_entrega,
      fecha_est_entrega: formData.fecha_est_entrega,
      fecha_recepcion: formData.fecha_recepcion,
      productos: formData.productos.map((producto: any) => ({
        id: producto.id,
        nombre_articulo: producto.nombre_articulo,
        costo: producto.costo,
        tipoArticulo: producto.tipo_articulo
      })),
      checklist: formData.checklist.map((item: any) => ({
        id: item.id,
        nombre: item.nombre
      }))
    
    };

    if (this.id > 0) {
      this.tipo.checklist = formData.selectedServicios
      // Es editar
      // this.datosServicioService.update(this.id, {...this.tipo, usuarioId: this.usuarioIdEdit , recepcionistaId: this.recepcionistaIdEdit}).pipe(takeUntil(this.destroy$)).subscribe(() => {
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 600);
      // }, error => {
      //   console.error('Error al actualizar:', error);
      // });
      console.log(this.tipo);
      
    } else {
      // Es crear
      this.datosServicioService.create({...this.tipo, usuarioId: this.usuarioId, recepcionistaId:this.recepcionistaId}).pipe(takeUntil(this.destroy$)).subscribe(() => {
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }, error => {
        console.error('Error al crear:', error);
      });
    }
  }

  eliminar() {
    this.movimientosService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, error => {
      console.error('Error al eliminar:', error);
    });
  }

  

  redirectToPDF(cardData: any) {
    console.log('cardData', cardData);
    
    const serviciosSerialized = JSON.stringify(cardData.Servicios);
    const checklistSerialized = JSON.stringify(cardData.checklist);
    const queryParams = { ...cardData, Servicios: serviciosSerialized, Checklist: checklistSerialized  };
    this.router.navigate(['admin/service-pdf'], { queryParams });
  }
// <========================================================= FUNCIONAMIENTO DE PICKLIST =======================================================================>
  get productos(): FormArray {
    return this.form.get('productos') as FormArray;
  }

  agregarProducto(producto: any) {
    const productoForm = this.fb.group({
      id: [producto.id, Validators.required],
      nombre_articulo: [producto.nombre_articulo, Validators.required],
      costo: [producto.costo || 0, Validators.required],
      tipoArticulo: [producto.tipoArticulo, Validators.required] 
    });
  
    this.productos.push(productoForm);
  }

  agregarProductoChecklist(producto: any) {
    const productoCheclistForm = this.fb.group({
      id: [producto.value, Validators.required],
      nombre: [producto.label, Validators.required] 
    });
  
    this.checklist.push(productoCheclistForm);
  }

  eliminarProductoCheckList(index: number) {
    this.checklist.removeAt(index);
  }

  eliminarProducto(index: number) {
    this.productos.removeAt(index);
  }

  agregarProductoDesdePickList(event: any) {
    console.log('evento',event);
    event.items.forEach((producto: any) => {
      this.agregarProducto(producto);
    });
  }

  agregarProductoDesdeCheckList(event: any) {
    console.log('evento',event);
    this.agregarProductoChecklist(event.itemValue);
    
  }

  eliminarProductoDesdePickList(event: any) {
    event.items.forEach((producto: any) => {
      const index = this.productos.controls.findIndex((control: any) => control.value.id === producto.id);
      if (index > -1) {
        this.eliminarProducto(index);
      }
    });
  }

  eliminarProductoDesdeCheckList(event: any) {
    event.value.forEach((producto: any) => {
      const index = this.checklist.controls.findIndex((control: any) => control.value.id === producto.id);
      if (index > -1) {
        this.eliminarProducto(index);
      }
    });
  }


  // <===================================== FUNCIONAMIENTO DE MODALES ========================================>
openServiceDialog() {
    this.crearVisible = false;
    this.datosServicioVisible =  true
  
}

asignarInsumos(data: any) {
  this.router.navigate(['admin/asignar-insumos', data.id]);
}



openServicesModal(){
  this.datosServicioVisible = false;
    this.serviciosVisible =  true
}

cerrarEdit(){
  this.editVisible = false;
}

cerrarServicios(){
  this.datosServicioVisible = false;
  this.cerrarEdit()
  
  this.servicios = this.ServiciosStatic
}

marcarCheckboxes(checklistOptions: any) {
  console.log('checklistOptions', checklistOptions);

  setTimeout(() => {
    checklistOptions.forEach((option: { id: any; }) => {
      const checkbox = document.getElementById(`${option.id}`) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }, 0);
}

modalOpen(data: any) {

  
  this.showModal = true;
  this.cardData = {...data,
    ServiciosTable: data.Servicios.filter((item: { tipoArticulo: string; }) => item.tipoArticulo === 'Servicio'),
    InsumoTable: data.Servicios.filter((item: { tipoArticulo: string; }) => item.tipoArticulo === 'Insumo'),
  };
  this.marcarCheckboxes(data.checklist);
}

pdfOpen(data: any) {

  this.redirectToPDF(data)
 
}

cerrarFecha(){
  this.fechasModal = false
  this.filteredProducts = []
}

filterByDate() {
  if (this.selectedDate) {

    const formattedSelectedDate = this.dateFormatterService.formatDateToDDMMYY(this.selectedDate)
    this.filteredProducts = this.products.filter(product => {
      console.log(product.DatosServicio.fecha_recepcion);
      
      const formattedProductDate = this.dateFormatterService.formatDateToDDMMYY(product.DatosServicio.fecha_recepcion)
      console.log(formattedProductDate);
      return formattedProductDate === formattedSelectedDate;
    });
    console.log(this.filteredProducts);
    
    this.fechasModal = true
  }
}


}


