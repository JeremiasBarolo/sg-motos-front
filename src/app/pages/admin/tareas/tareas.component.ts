import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from '../../../services/personas.service';
import { TipoArticuloService } from '../../../services/tipo-articulo.service';
import { AuthService } from '../../../services/auth.service';
import { TareasService } from '../../../services/tareas.service';
import { color } from 'html2canvas/dist/types/css/types/color';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
})
export class TareasComponent {
  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false
  editEliminar: boolean = false
  crearVisible: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  empleados: any[] = [];
  tipoArticulos: any[] = [];
  isAdmin: any;
  colores: any[] = [
    { color: 'rojo', prioridad: 'Alta' },
    { color: 'amarillo', prioridad: 'Media' },
    { color: 'verde', prioridad: 'Baja' },
  ];
  
  empleadoTareas:any[] = []
  private destroy$ = new Subject<void>();
  selectedClient: any
  empleadoChoice:any[] = []
  filteredProducts: any[] = []
  showTable: boolean =false




  constructor( 
    private tareasService: TareasService,
    private usuariosService: UsuariosService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private authService: AuthService
  ){

    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      usuarioId: ['', Validators.required],
      color: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();
  
    
    const uniqueEmpledos = new Set();
  
    this.tareasService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'titulo', header: 'Tarea' },
        { field: 'usuario', header: 'Empleado' },
        { field: 'estado', header: 'Estado' },
        { field: 'fecha_asignacion', header: 'Fecha Asig.' },
      ];
  
      data.forEach((item) => {
        this.products.push({
          id: item.id,
          titulo: item.titulo,
          descripcion: item.descripcion,
          usuario: item.usuario,
          usuarioId: item.usuarioId,
          color: item.color,
          estado: item.estado,
          fecha_asignacion: item.fecha_asignacion,
        });
  
        
        if (!uniqueEmpledos.has(item.usuarioId)) {
          uniqueEmpledos.add(item.usuarioId);
          this.empleadoChoice.push({ id: item.usuarioId, empleado: item.usuario });
        }
      });
    });
  
    this.usuariosService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.empleados = data.filter((item) => item.rolId == 2);
    });
  }
  
  // Función para filtrar tareas por empleado seleccionado
  filtrarPorEmpleado(idEmpleado: number): void {
    this.filteredProducts = this.products.filter(product => product.usuarioId === idEmpleado);
  }
  
  
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editarItem(data:any) {
    console.log(data);
    
    this.editVisible = true
    this.id = data.id
    this.cardData = data
    this.form.patchValue({
      titulo: data.titulo,
      descripcion: data.descripcion,
      usuarioId: data.usuarioId,
      color: data.color
    })
    
    
    
    
  }

  eliminarItem(data:any) {
    this.editEliminar = true
    this.id = data.id
  }
  
  onSubmit(){

    this.tipo = { 
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion,
      usuarioId: this.form.value.usuarioId,
      color: this.form.value.color,
      estado: this.id > 0 ? this.cardData.estado : 'Pendiente',
      
    }

      if(this.id > 0){
            // Es editar
            try {
              this.tareasService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
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
          this.tareasService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    this.tareasService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000)
      // this.router.navigate(['dashboard/insumos']);
    });
  }

  searchClientMovements() {
    
      this.empleadoTareas = this.products.filter(movement => movement.usuarioId === this.selectedClient.id);
      this.showTable = true;
    
  }
  
  

  onClientChange(event: any) {
    this.selectedClient = event.value;
    this.searchClientMovements();
  }




}
