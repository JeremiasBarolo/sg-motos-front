import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {



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
    private rolesService: RolesService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
  ){

    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      isAdmin: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'descripcion', header: 'Descripcion' },
        { field: 'isAdmin', header: 'Es Admin?' },
      ];
    this.loadPage({ page: 0, size: this.pageSize });
  }

  editarItem(data:any) {
    this.editVisible = true
    this.id = data.id
    if(data.isAdmin == "Si"){
      this.form.setValue({
        descripcion: data.descripcion,
        isAdmin: 1
      });
    }else{
      this.form.setValue({
        descripcion: data.descripcion,
        isAdmin: 0
      });
    
    }
    
    console.log(data);
    
    
  }

  eliminarItem(data:any) {
    this.editEliminar = true
    this.id = data.id
  }
  
  onSubmit(){

      if(this.form.value.isAdmin == 1){
        this.tipo = {
          descripcion: this.form.value.descripcion,
          isAdmin: 1
        }
      }else(
        this.tipo = {
          descripcion: this.form.value.descripcion,
          isAdmin: 0
        }
      )

      if(this.id > 0){
            // Es editar
            try {
              this.rolesService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.loadPage({ page: 0, size: this.pageSize })
              });

            } catch (error) {
              console.log(error);
            }
      }else{
        // Es crear
        try {
          this.rolesService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadPage({ page: 0, size: this.pageSize })
          });
          
        } catch (error) {
          console.log(error);
        }
      }
  }

  
  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    this.rolesService.getPage(event.page, event.size).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const mapped = mapPaginatedResponse(response, (data) => ({
          id: data.id,
          descripcion: data.descripcion,
          isAdmin: this.isAdmin(data.isAdmin),
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

  Eliminar(){
    this.rolesService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadPage({ page: 0, size: this.pageSize })
      // this.router.navigate(['dashboard/insumos']);
    });
  }

  isAdmin(data:any){
    if(data == 1){
      return "Si"
    }else{
      return "No"
    }
  }
  
}

