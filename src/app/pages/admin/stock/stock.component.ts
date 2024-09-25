import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from '../../../services/personas.service';
import { StockService } from '../../../services/stock.service';
import { TipoArticuloService } from '../../../services/tipo-articulo.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {
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
      tipoArticuloId: ['', Validators.required],
      personaId: ['', Validators.required],
      costo: ['', Validators.required],
      cantidad: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();

    this.stockService.getAllStockGeneral().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'nombre_articulo', header: 'Nombre Articulo' },
        { field: 'descripcion', header: 'Descripcion' },
        { field: 'tipoArticulo', header: 'Tipo Articulo' },
        { field: 'proveedor', header: 'Proveedor' },
        { field: 'costo', header: 'Costo' },
        { field: 'cantidad', header: 'Cantidad' },
        

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
      tipoArticuloId: data.tipoArticuloId,
      personaId: data.proveedorId,
      costo: data.costo,
      cantidad: data.cantidad,
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
      tipoId: this.form.value.tipoArticuloId,
      personaId: this.form.value.personaId,
      costo: this.form.value.costo,
      cantidad: this.form.value.cantidad,
    }

      if(this.id > 0){
            // Es editar
            try {
              this.stockService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 600)
              });

            } catch (error) {
              console.log(error);
            }
      }else{
        // Es crear
        try {
          this.stockService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
            setTimeout(() => {
              window.location.reload();
            }, 600)
          });
          
        } catch (error) {
          console.log(error);
        }
      }
  }

  Eliminar(){
    this.stockService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000)
      // this.router.navigate(['dashboard/insumos']);
    });
  }

  asignarInsumos(data:any){}
modalOpen(data:any){}
pdfOpen(data:any){}


}
