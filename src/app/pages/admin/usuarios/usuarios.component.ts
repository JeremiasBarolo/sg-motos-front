import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';
import { UsuariosService } from '../../../services/usuarios.service';
import { PersonasService } from '../../../services/personas.service';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {


  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false
  editEliminar: boolean = false
  crearVisible: boolean = false
  cambioPassword: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  empleados: any[] = [];
  roles: any[] = [];
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;

  private destroy$ = new Subject<void>();




  constructor( 
    private usuariosService: UsuariosService,
    private personasService: PersonasService,
    private rolService: RolesService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
  ){

    this.form = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      personaId: ['', Validators.required],
      rolId: ['', Validators.required],
      newPassword: ['', Validators.required],
      rnewPassword: ['', Validators.required],
    
    });
  }
  
  ngOnInit(): void {
    this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'user', header: 'Usuario' },
        { field: 'name', header: 'Nombre' },
        { field: 'lastname', header: 'Apellido' },
        { field: 'rol', header: 'Rol' },
        

      ];
    this.loadPage({ page: 0, size: this.pageSize });

    this.personasService.getAllEmpleados().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.empleados = data;
    });

    this.rolService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.roles = data;
    });
  }

  editarItem(data:any) {
    this.editVisible = true
    this.id = data.id
    this.cardData = data
    this.form.patchValue({
      user: data.user,
      password: data.password,
      name: data.name,
      lastname: data.lastname,
      personaId: data.personaId,
      rolId: data.rolId,
    })
    
    
    
    
  }

  eliminarItem(data:any) {
    this.editEliminar = true
    this.id = data.id
  }

  CambiarPassword(cardData:any){
      this.tipo = {
        newPassword: this.form.value.newPassword,
        user: cardData.user,
        password: cardData.password,
        personaId: cardData.personaId,
        rolId: cardData.rolId,

      }
       
        try {
          this.usuariosService.updatePassword(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadPage({ page: 0, size: this.pageSize })
          });

        } catch (error) {
          console.log(error);
        }

    
  }
  
  onSubmit(){

    this.tipo = {
      user: this.form.value.user,
      password: this.form.value.password,
      name: this.form.value.name,
      lastname: this.form.value.lastname,
      personaId: this.form.value.personaId,
      rolId: this.form.value.rolId,
    }


   

      if(this.id > 0){
            // Es editar
            try {
              this.usuariosService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.loadPage({ page: 0, size: this.pageSize })
              });

            } catch (error) {
              console.log(error);
            }
      }else{
        // Es crear
        try {
          this.usuariosService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadPage({ page: 0, size: this.pageSize })
          });
          
        } catch (error) {
          console.log(error);
        }
      }
  }

  Eliminar(){
    this.usuariosService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadPage({ page: 0, size: this.pageSize })
      // this.router.navigate(['dashboard/insumos']);
    });
  }

  
  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    this.usuariosService.getPage(event.page, event.size).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        const mapped = mapPaginatedResponse(response, (data) => ({
          id: data.id,
          user: data.user,
          name: data.name,
          lastname: data.lastname,
          rol: data.rol,
          rolId: data.rolId,
          personaId: data.personaId,
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

  abrirCambioPassword(){
    this.editVisible = false
    this.cambioPassword = true
  }

}
