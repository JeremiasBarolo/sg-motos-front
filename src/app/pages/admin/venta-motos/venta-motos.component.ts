import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PersonasService } from '../../../services/personas.service';
import { StockService } from '../../../services/stock.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { MovimientosService } from '../../../services/movimientos.service';
import { DatePipe } from '@angular/common';
import { MotosService } from '../../../services/motos.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { mapPaginatedResponse, PageChangeEvent, unwrapList } from '../../../models/paginated-response';

@Component({
  selector: 'app-venta-motos',
  templateUrl: './venta-motos.component.html',
  styleUrls: ['./venta-motos.component.css'],
  providers: [DatePipe]
})
export class VentaMotosComponent implements OnDestroy, OnInit {
  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false;
  editEliminar: boolean = false;
  crearVisible: boolean = false;
  detailModal: boolean = false;
  DataModalVisible : boolean = false;
  
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  usuarios: any[] = [];
  clientes: any[] = [];
  motos: any[] = [];
  motosDisponibles: any[] = [];
  private destroy$ = new Subject<void>();
  usuarioId: any;
  usuarioIdEdit: any;
  comprobarDatosAdicionales: boolean = false; 
  clientHasInfo:boolean = false
  operacionHasInfo:boolean = false
  tipoMovimientoChoise: any[] = []
  selectedTipo: any;
  filteredProducts: any[]= []
  selectedDate: any;
  fechasModal: boolean = false;
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;

  constructor(
    private usuariosService: UsuariosService,
    private personasService: PersonasService,
    private motoService: MotosService,
    private movimientosService: MovimientosService,
    private authService: AuthService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private messageService: MessageService,
    private renderer: Renderer2
  ) {
    this.form = this.fb.group({
      usuarioId: ['', Validators.required],
      personaId: ['', Validators.required],
      motoId: ['', Validators.required],
      productos: this.fb.array([])
    });

  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.authService.getUserData().subscribe((data: any) => {
      this.usuarioId = data.userId;
    });

    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'nombreMoto', header: 'Moto' },
      { field: 'createdAt', header: 'Fecha de Realizacion' },
      { field: 'cliente', header: 'Cliente' },
      { field: 'usuario', header: 'Recepcionista' },
      { field: 'TipoMovimiento', header: 'Tipo Movimiento' },
      { field: 'subtotal', header: 'Subtotal' },
    ];
    this.loadPage({ page: 0, size: this.pageSize });

    this.usuariosService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.usuarios = unwrapList(data);
    });

    this.loadClientes();
    this.loadMotosDisponibles();
  }

  loadClientes(): void {
    this.personasService.getAllClientes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: () => {
        this.clientes = [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes',
        });
      },
    });
  }

  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    const uniqueTipos = new Set<string>();
    this.movimientosService
      .getPageVentasMoto(event.page, event.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mapped = mapPaginatedResponse(response, (item) => {
            if (!uniqueTipos.has(item.TipoMovimiento)) {
              uniqueTipos.add(item.TipoMovimiento);
              this.tipoMovimientoChoise.push({ TipoMovimiento: item.TipoMovimiento });
            }
            return {
              id: item.id,
              createdAt: this.datePipe.transform(item.createdAt, 'dd/MM/yy'),
              cliente: item.cliente,
              usuario: item.usuario,
              subtotal: item.subtotal,
              usuarioId: item.usuarioId,
              clienteId: item.clienteId,
              personaId: item.personaId,
              Moto: item.Moto,
              motoId: item.Moto.id,
              tipoMovimientoId: item.tipoMovimientoId,
              TipoMovimiento: item.TipoMovimiento,
              ClienteHasInfo: item.ClienteHasInfo,
              OperacionHasInfo: item.OperacionHasInfo,
              nombreMoto: `${item.Moto.marca} ${item.Moto.modelo}`,
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

  loadMotosDisponibles(excludeMotoId?: number): void {
    this.motoService.getAllDisponibles(excludeMotoId).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const list = unwrapList(data);
      this.motosDisponibles = list.map((moto: any) => ({
        ...moto,
        nombreMoto: `${moto.Marca} ${moto.modelo}`,
        motoId: moto.id,
      }));
    });
  }

  openCrearVentaDialog(): void {
    this.id = 0;
    this.form.reset();
    this.loadClientes();
    this.loadMotosDisponibles();
    this.crearVisible = true;
  }

  editarItem(data: any) {
    this.editVisible = true;
    this.id = data.id;
    this.loadClientes();
    this.loadMotosDisponibles(data.motoId);
    this.form.patchValue({
      personaId: data.personaId,
      motoId: data.motoId
    });
  }

  eliminarItem(data: any) {
    this.editEliminar = true;
    this.id = data.id;
  }

  onSubmit() {
    const formValue = this.form.value;
    this.tipo = {
      usuarioId: this.id > 0 ? this.usuarioIdEdit : this.usuarioId,
      personaId: formValue.personaId,
      motoId: formValue.motoId,
      tipoMovimientoId: 2
    };

    if (this.id > 0) {
      this.movimientosService.updateVentaMoto(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.crearVisible = false;
        this.editVisible = false;
        this.loadMotosDisponibles();
        this.loadPage({ page: 0, size: this.pageSize });
      });
    } else {
      this.movimientosService.createVentaMoto(this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.crearVisible = false;
        this.loadMotosDisponibles();
        this.loadPage({ page: 0, size: this.pageSize });
      });
    }
  }

  Eliminar() {
    this.movimientosService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadPage({ page: 0, size: this.pageSize });
    });
  }

  modalOpen(data: any) {
    this.detailModal = true;
    this.cardData = data;
  }

  redirectToPDF(cardData: any) {
    const MotoData = JSON.stringify(cardData.Moto);
    const OperacionesData = JSON.stringify(cardData.OperacionHasInfo);
    const queryParams = { ...cardData, Moto: MotoData,  OperacionesData: OperacionesData  };
    this.router.navigate(['admin/pdfVenta'], { queryParams });
  }

  

  openComprobarModal(data:any){
    console.log(data);
    
    data.OperacionHasInfo ? this.operacionHasInfo = true : this.operacionHasInfo = false;
    data.ClienteHasInfo ? this.clientHasInfo = true : this.clientHasInfo = false;
    this.cardData = data;
    this.comprobarDatosAdicionales = true
    
  }

  redirectOperaciones(data:any, accion?:any){
    console.log(data);
    
    this.comprobarDatosAdicionales = false
    if(accion == 'OPERACION' && data.OperacionHasInfo){
      this.router.navigate(['admin/operacion','editar', data.subtotal, data.id]);

    }else if(accion == 'OPERACION' && !data.OperacionHasInfo){
      this.router.navigate(['admin/operacion','crear', data.subtotal, data.id]);

    }else if(accion == 'ADICIONALES' && data.OperacionesHasInfo){
      this.router.navigate(['admin/adicionales','editar', data.clienteId]);

    }else{
      this.router.navigate(['admin/adicionales','crear', data.clienteId]);
    }
  }


  
  searchClientMovements() {
    this.filteredProducts = this.products.filter(movement => movement.TipoMovimiento === this.selectedTipo.TipoMovimiento);
    this.DataModalVisible = true;
  }

  onClientChange(event: any) {
    this.selectedTipo = event.value;
    this.searchClientMovements();
  }

  cerrarData() {
    this.DataModalVisible = false;
    this.filteredProducts = [];
    this.selectedTipo = null;
    setTimeout(() => {
      this.selectedTipo = undefined;
    });
  }

  cerrarFecha(){
    this.fechasModal = false
    this.filteredProducts = []
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
}

