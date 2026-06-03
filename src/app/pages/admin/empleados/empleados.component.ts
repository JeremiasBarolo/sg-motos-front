import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from '../../../services/personas.service';
import { TipoPersonasService } from '../../../services/tipo-personas.service';
import { LocalidadesService } from '../../../services/localidades.service';
import { DatePipe } from '@angular/common';
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css',
  providers: [DatePipe]
})
export class EmpleadosComponent {
  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false
  editEliminar: boolean = false
  crearVisible: boolean = false
  modalData: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  tipoPersonas: any[] = [];
  roles: any[] = [];
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;

  private destroy$ = new Subject<void>();




  constructor( 
    private personasService: PersonasService,
    private localidadService: LocalidadesService,
    private tipoPersona: TipoPersonasService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private datePipe: DatePipe
  ){

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      cuit: ['', Validators.required],
      mail: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      nro_direccion: ['', Validators.required],
      localidadId: ['', Validators.required],
      
      
    });
  }
  
  ngOnInit(): void {

    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'nombreCompleto', header: 'Nombre' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccionCompleta', header: 'Direccion' },
      { field: 'mail', header: 'Correo Elec.' },
    ];
    this.loadPage({ page: 0, size: this.pageSize });

    

    this.localidadService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.roles = data;
    })

   
  }

  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    this.personasService
      .getPageEmpleados(event.page, event.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mapped = mapPaginatedResponse(response, (data) => ({
            id: data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            nombreCompleto: `${data.nombre} ${data.apellido}`,
            cuit: data.cuit,
            dni: data.dni,
            fecha_nacimientoFormatted: this.datePipe.transform(data.fecha_nacimiento, 'dd/MM/yy'),
            fecha_nacimiento: data.fecha_nacimiento,
            telefono: data.telefono,
            direccion: data.direccion,
            direccionCompleta: `${data.direccion} ${data.nro_direccion}, ${data.Localidad}`,
            mail: data.mail,
            tipoPersona: data.tipoPersona,
            nro_direccion: data.nro_direccion,
            password: data.password,
            localidad: data.Localidad,
            tipoPersonaId: data.tipoPersonaId,
            localidadId: data.LocalidadId,
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

  editarItem(data:any) {
    this.editVisible = true
    this.id = data.id
    const fechaNacimiento = new Date(data.fecha_nacimiento).toISOString().split('T')[0];
    
    this.form.patchValue({
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      cuit: data.cuit,
      mail: data.mail,
      fecha_nacimiento: fechaNacimiento,
      telefono: data.telefono,
      direccion: data.direccion,
      nro_direccion: data.nro_direccion,
      localidadId: data.localidadId,
      
    })
    
    
    
    
  }

  eliminarItem(data:any) {
    this.editEliminar = true
    this.id = data.id
  }
  
  onSubmit(){

    const fechaNacimiento = this.form.value.fecha_nacimiento;
    const formattedDate = this.datePipe.transform(fechaNacimiento, 'dd/MM/yy');

    this.tipo = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      dni: this.form.value.dni,
      cuit: this.form.value.cuit,
      mail: this.form.value.mail,
      fecha_nacimiento: fechaNacimiento,
      telefono: this.form.value.telefono,
      direccion: this.form.value.direccion,
      nro_direccion: this.form.value.nro_direccion,
      localidadId: this.form.value.localidadId,
      tipoPersonaId: 2
    }

      if(this.id > 0){
            // Es editar
            try {
              this.personasService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.loadPage({ page: 0, size: this.pageSize });
              });

            } catch (error) {
              console.log(error);
            }
      }else{
        // Es crear
        try {
          this.personasService.create(this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
            setTimeout(() => {
              this.loadPage({ page: 0, size: this.pageSize });
            }, 600)
          });
          
        } catch (error) {
          console.log(error);
        }
      }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  Eliminar(){
    this.personasService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadPage({ page: 0, size: this.pageSize });
      // this.router.navigate(['dashboard/insumos']);
    });
  }

  modalOpen(data:any){
    this.cardData = data;
    this.modalData = true;
  }

}
