import { Component, OnInit } from '@angular/core';
import { TipoArticuloService } from '../../../services/tipo-articulo.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';
import { TipoMovimientosService } from '../../../services/tipo-movimientos.service';

@Component({
  selector: 'app-tipo-movimientos',
  templateUrl: './tipo-movimientos.component.html',
  styleUrl: './tipo-movimientos.component.css'
})
export class TipoMovimientosComponent implements OnInit {



  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false
  editEliminar: boolean = false
  crearVisible: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;

  private destroy$ = new Subject<void>();




  constructor( 
    private tipoMovimientosService: TipoMovimientosService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
  ){

    this.form = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'descripcion', header: 'Descripcion' },
      ];
    this.loadPage({ page: 0, size: this.pageSize });
  }

  editarItem(data:any) {
    this.editVisible = true
    this.id = data.id
    this.form.setValue({
      descripcion: data.descripcion,
    });
    console.log(data);
    
    
  }

  eliminarItem(data:any) {
    this.editEliminar = true
    this.id = data.id
  }
  
  onSubmit(){
    
      this.tipo = {
        descripcion: this.form.value.descripcion,
      }

      if(this.id > 0){
            // Es editar
            try {
              this.tipoMovimientosService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.loadPage({ page: 0, size: this.pageSize })
              });

            } catch (error) {
              console.log(error);
            }
      }else{
        // Es crear
        try {
          this.tipoMovimientosService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadPage({ page: 0, size: this.pageSize })
          });
          
        } catch (error) {
          console.log(error);
        }
      }
  }

  Eliminar(){
    this.tipoMovimientosService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadPage({ page: 0, size: this.pageSize })
      // this.router.navigate(['dashboard/insumos']);
    });
  }

  
  
  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    this.tipoMovimientosService.getPage(event.page, event.size).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const mapped = mapPaginatedResponse(response, (data) => ({
          id: data.id,
          descripcion: data.descripcion
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
  

}
