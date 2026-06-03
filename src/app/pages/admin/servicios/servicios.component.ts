import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';
import { PersonasService } from '../../../services/personas.service';
import { StockService } from '../../../services/stock.service';
import { TipoArticuloService } from '../../../services/tipo-articulo.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false
  editEliminar: boolean = false
  crearVisible: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  proveedores: any[] = [];
  tipoArticulos: any[] = [];
  isAdmin: any;
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;

  private destroy$ = new Subject<void>();




  constructor( 
    private stockService: StockService,
    private personasService: PersonasService,
    private tipoArticuloService: TipoArticuloService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private authService: AuthService
  ){

    this.form = this.fb.group({
      nombre_articulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      personaId: ['', Validators.required],
      costo: ['', Validators.required],

    });
  }
  
  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();

    this.stockService.getAllServicios().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'nombre_articulo', header: 'Nombre Articulo' },
        { field: 'descripcion', header: 'Descripcion' },
        { field: 'proveedor', header: 'Proveedor' },
        { field: 'costo', header: 'Costo' },
        
        

      ];

      data.map((data)=>{

        this.products.push({
          id: data.id,
          nombre_articulo: data.nombre_articulo,
          descripcion: data.descripcion,
          tipoArticulo: data.tipoArticulo,
          proveedor: data.proveedor,
          costo: data.costo,
          proveedorId: data.proveedorId,
          tipoArticuloId: data.tipoArticuloId,
          cantidad: data.cantidad,
        
          
        })
      })
    })

    this.personasService.getAllProveedores().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.proveedores = data;
      
      
    })

    this.tipoArticuloService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.tipoArticulos = data;
    })

   
  }
  
  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    this.stockService
      .getPageServicios(event.page, event.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mapped = mapPaginatedResponse(response, (data) => ({
            id: data.id,
            nombre_articulo: data.nombre_articulo,
            descripcion: data.descripcion,
            tipoArticulo: data.tipoArticulo,
            proveedor: data.proveedor,
            costo: data.costo,
            proveedorId: data.proveedorId,
            tipoArticuloId: data.tipoArticuloId,
            cantidad: data.cantidad
          }));
          this.products = mapped.items;
          this.totalRecords = mapped.totalRecords;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editarItem(data:any) {
    this.editVisible = true
    this.id = data.id
    this.form.patchValue({
      nombre_articulo: data.nombre_articulo,
      descripcion: data.descripcion,
      personaId: data.proveedorId,
      costo: data.costo,
    })
    
    
    
    
  }

  eliminarItem(data:any) {
    this.editEliminar = true
    this.id = data.id
  }
  
  onSubmit(){

    this.tipo = {
      nombre: this.form.value.nombre_articulo,
      descripcion: this.form.value.descripcion,
      tipoId: 3,
      personaId: this.form.value.personaId,
      costo: this.form.value.costo,
      cantidad: 1,
    }

      if(this.id > 0){
            // Es editar
            try {
              this.stockService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.loadPage({ page: 0, size: this.pageSize })
              });

            } catch (error) {
              console.log(error);
            }
      }else{
        // Es crear
        try {
          this.stockService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadPage({ page: 0, size: this.pageSize })
          });
          
        } catch (error) {
          console.log(error);
        }
      }
  }

  Eliminar(){
    this.stockService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadPage({ page: 0, size: this.pageSize })
      // this.router.navigate(['dashboard/insumos']);
    });
  }

  


}
