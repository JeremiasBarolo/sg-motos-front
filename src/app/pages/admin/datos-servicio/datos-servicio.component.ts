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
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';
import { MessageService } from 'primeng/api';

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
  tipo: any;
  /** Datos del paso 1 (modales cerrados no exponen controles al submit). */
  private formSnapshot: any = null;
  private destroy$ = new Subject<void>();
  selectedServicios: any;
  usuarioId:any
  usuarioIdEdit:any
  recepcionistaId:any
  recepcionistaIdEdit:any
  selectedDate: any;
  fechasModal: boolean = false
  filteredProducts: any[] = []
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;

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
    private dateFormatterService: DateFormatterService,
    private messageService: MessageService
    
  ) {
    this.form = this.fb.group({
      modelo: ['', Validators.required],
      num_motor: ['', Validators.required],
      patente: ['', Validators.required],
      color: ['', Validators.required],
      tipo_servicio: [null, Validators.required],
      kilometros: ['', Validators.required],
      estado_general: ['', Validators.required],
      observaciones: ['', Validators.required],
      recepcionistaId: ['', Validators.required],
      hora_est_entrega: ['', Validators.required],
      fecha_est_entrega: ['', Validators.required],
      fecha_recepcion: ['', Validators.required],
      num_chasis: ['', Validators.required],
      personaId: [null, Validators.required],
      selectedServicios: [[]],
      checklist: this.fb.array([]),
      productos: this.fb.array([])
    });
  }

  ngOnInit(): void {

    this.authService.getUserData().subscribe((data: any) => {
      this.usuarioId = data.userId;
      this.recepcionistaId = data.personaId;
      if (data.personaId != null) {
        this.form.patchValue({ recepcionistaId: data.personaId });
      }
    });


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
    this.loadPage({ page: 0, size: this.pageSize });

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

    this.personasService.getAllClientes().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.clientes = data;
    });

    this.tipoServicioService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tipoServicio = data ?? [];
      if (this.tipoServicio.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Tipos de servicio',
          detail: 'No hay tipos de servicio cargados. Ejecute el seeder de TipoServicio en el backend.',
        });
      }
    })

    this.loadChecklistOptions();
   
  }

  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    this.movimientosService
      .getPageServices(event.page, event.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mapped = mapPaginatedResponse(response, (item) => {
            const ds = item.DatosServicio ?? item;
            return {
              id: item.id,
              personaId: item.personaId,
              usuarioId: item.usuarioId,
              cliente: item.cliente,
              modelo: ds.modelo,
              num_motor: ds.num_motor,
              num_chasis: ds.num_chasis,
              patente: ds.patente,
              color: ds.color,
              tipo_servicio: item.TipoServicio ?? ds.tipo_servicio,
              tipoServicioId: item.tipoServicioId,
              kilometros: ds.kilometros,
              estado_general: ds.estado_general,
              observaciones: ds.observaciones,
              Recepcionista: item.Recepcionista,
              fecha_recepcion: this.dateFormatterService.formatDateToDDMMYY(ds.fecha_recepcion),
              fecha_est_entrega: this.dateFormatterService.formatDateToDDMMYY(ds.fecha_est_entrega),
              hora_est_entrega: ds.hora_est_entrega,
              recepcionistaId: ds.recepcionistaId,
              DatosServicio: ds,
              datosServicioId: item.datosServiciosId ?? ds.id,
              Servicios: item.Servicios ?? [],
              subtotal: item.subtotal,
              checklist: item.checklist ?? [],
            };
          });
          this.products = mapped.items;
          this.totalRecords = mapped.totalRecords;
          this.serverSide = mapped.serverSide;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar servicios:', err);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Listado',
            detail: 'No se pudo cargar el listado de servicios.',
          });
        },
      });
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

  private formatHoraForInput(hora: unknown): string {
    if (hora == null || hora === '') {
      return '';
    }
    if (typeof hora === 'number') {
      return `${String(hora).padStart(2, '0')}:00`;
    }
    const str = String(hora);
    if (str.includes(':')) {
      return str.slice(0, 5);
    }
    const hour = parseInt(str, 10);
    if (!Number.isNaN(hour) && hour >= 0 && hour <= 23) {
      return `${String(hour).padStart(2, '0')}:00`;
    }
    return str;
  }

  editarItem(data: any) {
    this.formSnapshot = null;
    this.editVisible = true;
    this.id = data.id;
    this.usuarioIdEdit = data.usuarioId;
    const ds = data.DatosServicio ?? data;
    this.recepcionistaIdEdit = ds.recepcionistaId ?? data.recepcionistaId;

    const fecha_est_entrega = new Date(ds.fecha_est_entrega).toISOString().split('T')[0];
    const fecha_recepcion = new Date(ds.fecha_recepcion).toISOString().split('T')[0];
    const hora_est_entrega = this.formatHoraForInput(data.hora_est_entrega ?? ds.hora_est_entrega);

    this.form.patchValue({
      personaId: data.personaId,
      modelo: ds.modelo,
      patente: ds.patente,
      color: ds.color,
      num_motor: ds.num_motor,
      num_chasis: ds.num_chasis,
      tipo_servicio: ds.tipo_servicio ?? data.tipoServicioId,
      kilometros: ds.kilometros,
      estado_general: ds.estado_general,
      observaciones: ds.observaciones,
      hora_est_entrega,
      fecha_est_entrega,
      fecha_recepcion,
      recepcionistaId: this.recepcionistaIdEdit,
      selectedServicios: (data.checklist ?? []).map((item: any) => ({
        value: item.id,
        label: item.nombre,
      })),
    });

    this.productos.clear();
    this.checklist.clear();
    (data.Servicios ?? []).forEach((item: any) => {
      this.agregarProducto({
        id: item.id,
        nombre_articulo: item.nombre ?? item.nombre_articulo,
        costo: item.costo,
        tipoArticulo: item.tipoArticulo ?? item.tipo_articulo,
      });
    });
    (data.checklist ?? []).forEach((item: any) => {
      this.agregarProductoChecklist({ value: item.id, label: item.nombre });
    });

    this.servicios = this.ServiciosStatic.filter(
      (servicio) => !(data.Servicios ?? []).some((item: any) => item.id === servicio.id)
    );
    
    

    
  }

  eliminarItem(data: any) {
    this.editEliminar = true;
    this.id = data.id;
  }

  

  iniciarCreacion(): void {
    this.id = 0;
    this.formSnapshot = null;
    this.form.reset();
    this.productos.clear();
    this.checklist.clear();
    this.servicios = this.ServiciosStatic;
    this.crearVisible = true;
  }

  private captureFormSnapshot(): void {
    this.formSnapshot = {
      ...(this.formSnapshot ?? {}),
      ...this.form.getRawValue(),
      productos: this.productos.getRawValue(),
      checklist: this.checklist.getRawValue(),
    };
  }

  private getFormDataForSubmit(): any {
    const current = this.form.getRawValue();
    const snapshot = this.formSnapshot ?? {};
    return {
      ...snapshot,
      ...current,
      productos: this.productos.length
        ? this.productos.getRawValue()
        : (snapshot.productos ?? current.productos ?? []),
      checklist: this.checklist.length
        ? this.checklist.getRawValue()
        : (snapshot.checklist ?? current.checklist ?? []),
      selectedServicios: current.selectedServicios?.length
        ? current.selectedServicios
        : (snapshot.selectedServicios ?? []),
    };
  }

  private validateSubmitData(data: any): boolean {
    const recepcionistaActivo =
      this.id > 0 ? this.recepcionistaIdEdit ?? this.recepcionistaId : this.recepcionistaId;

    if (!recepcionistaActivo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Sesión',
        detail: 'No se pudo identificar al recepcionista. Vuelva a iniciar sesión.',
      });
      return false;
    }

    const required: Array<{ key: string; label: string }> = [
      { key: 'personaId', label: 'cliente' },
      { key: 'tipo_servicio', label: 'tipo de servicio' },
      { key: 'modelo', label: 'modelo' },
      { key: 'patente', label: 'patente' },
      { key: 'color', label: 'color' },
      { key: 'num_motor', label: 'número de motor' },
      { key: 'num_chasis', label: 'número de chasis' },
      { key: 'kilometros', label: 'kilómetros' },
      { key: 'estado_general', label: 'estado general' },
      { key: 'observaciones', label: 'observaciones' },
      { key: 'fecha_recepcion', label: 'fecha de recepción' },
      { key: 'fecha_est_entrega', label: 'fecha estimada de entrega' },
      { key: 'hora_est_entrega', label: 'hora estimada de entrega' },
    ];

    const missing = required
      .filter(({ key }) => data[key] === null || data[key] === undefined || data[key] === '')
      .map(({ label }) => label);

    if (missing.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Datos incompletos',
        detail: `Revise: ${missing.join(', ')}`,
      });
      return false;
    }

    return true;
  }

  private ensureFormValid(): boolean {
    const recepcionistaActivo =
      this.id > 0 ? this.recepcionistaIdEdit ?? this.recepcionistaId : this.recepcionistaId;

    if (!recepcionistaActivo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Sesión',
        detail: 'No se pudo identificar al recepcionista. Vuelva a iniciar sesión.',
      });
      return false;
    }
    this.form.patchValue({ recepcionistaId: recepcionistaActivo }, { emitEvent: false });

    if (this.form.valid) {
      return true;
    }
    this.form.markAllAsTouched();
    const fieldLabels: Record<string, string> = {
      productos: 'productos/servicios seleccionados',
      personaId: 'cliente',
      tipo_servicio: 'tipo de servicio',
      hora_est_entrega: 'hora estimada de entrega',
    };
    const invalidFields = Object.keys(this.form.controls)
      .filter((key) => this.form.get(key)?.invalid)
      .map((key) => fieldLabels[key] ?? key);
    this.messageService.add({
      severity: 'error',
      summary: 'Formulario incompleto',
      detail: invalidFields.length
        ? `Revise: ${invalidFields.join(', ')}`
        : 'Complete todos los campos obligatorios antes de continuar.',
    });
    return false;
  }

  private buildUpdatePayload(formData: any) {
    const checklist =
      formData.selectedServicios?.length > 0
        ? formData.selectedServicios
        : (formData.checklist ?? []);

    return {
      ...this.buildCreatePayload(formData),
      checklist,
      personaId: Number(formData.personaId),
      usuarioId: this.usuarioIdEdit,
    };
  }

  private resetAfterSave(): void {
    this.id = 0;
    this.formSnapshot = null;
    this.crearVisible = false;
    this.editVisible = false;
    this.datosServicioVisible = false;
    this.serviciosVisible = false;
    this.productos.clear();
    this.checklist.clear();
    this.form.reset();
    this.servicios = this.ServiciosStatic;
  }

  private buildCreatePayload(formData: any) {
    return {
      personaId: Number(formData.personaId),
      modelo: formData.modelo,
      color: formData.color,
      patente: formData.patente,
      num_motor: formData.num_motor,
      num_chasis: formData.num_chasis,
      tipo_servicio: Number(formData.tipo_servicio),
      kilometros: Number(formData.kilometros),
      estado_general: formData.estado_general,
      observaciones: formData.observaciones,
      recepcionistaId: this.id > 0 ? this.recepcionistaIdEdit ?? this.recepcionistaId : this.recepcionistaId,
      hora_est_entrega: formData.hora_est_entrega,
      fecha_est_entrega: formData.fecha_est_entrega,
      fecha_recepcion: formData.fecha_recepcion,
      productos: (formData.productos ?? []).map((producto: any) => ({
        id: producto.id,
        nombre_articulo: producto.nombre_articulo ?? producto.nombre,
        costo: producto.costo,
        tipoArticulo: producto.tipoArticulo ?? producto.tipo_articulo,
      })),
      checklist: (formData.checklist ?? []).map((item: any) => ({
        id: item.id,
        nombre: item.nombre
      }))
    };
  }

  private showApiError(error: any): void {
    const body = error?.error;
    if (body?.details?.length) {
      const detail = body.details.map((item: { message: string }) => item.message).join(' ');
      this.messageService.add({ severity: 'error', summary: 'Error de validación', detail });
      return;
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: body?.message || body?.error || 'No se pudo guardar el servicio.',
    });
  }

  onSubmit() {
    this.captureFormSnapshot();
    const formData = this.getFormDataForSubmit();

    if (!this.validateSubmitData(formData)) {
      return;
    }

    if (this.id > 0) {
      const payload = this.buildUpdatePayload(formData);
      this.datosServicioService.update(this.id, payload).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.loadPage({ page: 0, size: this.pageSize });
          this.resetAfterSave();
          this.messageService.add({
            severity: 'success',
            summary: 'Servicio actualizado',
            detail: 'Los cambios se guardaron correctamente.',
          });
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.showApiError(error);
        },
      });
      return;
    }

    const payload = this.buildCreatePayload(formData);
    this.datosServicioService.create({ ...payload, usuarioId: this.usuarioId }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadPage({ page: 0, size: this.pageSize });
        this.resetAfterSave();
        this.messageService.add({
          severity: 'success',
          summary: 'Servicio creado',
          detail: 'El servicio se registró correctamente.',
        });
      },
      error: (error) => {
        console.error('Error al crear:', error);
        this.showApiError(error);
      },
    });
  }

  eliminar() {
    this.movimientosService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadPage({ page: 0, size: this.pageSize });
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
      nombre_articulo: [producto.nombre_articulo ?? producto.nombre, Validators.required],
      costo: [producto.costo || 0, Validators.required],
      tipoArticulo: [producto.tipoArticulo ?? producto.tipo_articulo, Validators.required],
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
    if (!this.ensureFormValid()) {
      return;
    }
    this.captureFormSnapshot();
    this.crearVisible = false;
    this.editVisible = false;
    this.datosServicioVisible = true;
}

asignarInsumos(data: any) {
  this.router.navigate(['admin/asignar-insumos', data.id]);
}



openServicesModal() {
  this.captureFormSnapshot();
  this.datosServicioVisible = false;
  this.serviciosVisible = true;
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


