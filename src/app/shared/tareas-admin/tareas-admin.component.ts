import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { color } from 'html2canvas/dist/types/css/types/color';
import { TareasService } from '../../services/tareas.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tareas-admin',
  templateUrl: './tareas-admin.component.html',
  styleUrl: './tareas-admin.component.css'
})
export class TareasAdminComponent implements OnInit, OnDestroy {



  

  userData: any 
  currentPage: number = 0;
  pageSize: number = 10; 
  totalRecords: number = 0
  private destroy$ = new Subject<void>();
  
  @Input() tareas: any[] = [];
  @Output() modalOpenClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private tareasService: TareasService,
    private authService: AuthService,
    private messageService: MessageService,
  ){}


  ngOnInit(): void {

      console.log(this.tareas);
      
      
    

      
  }

  

  get pagedTareas(): any[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.tareas.slice(start, end);
  }

  tareaEnProceso(tarea: any){
    tarea.estado = 'En Proceso';
  }

  finalizarTarea(tarea: any) {
    tarea.estado = 'Completada';
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
  }

  modalOpen(rowData: any) {
    this.modalOpenClick.emit(rowData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tareas = []
  }
  

  completed(id:number, estado:any){
    try {
      this.tareasService.update(id, {
        
        estado: estado
      
      }).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Exito', detail: `Tarea ${estado}`});
      })

      
    } catch (error) {
      console.log(error);
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Algo salio mal'});
    }

  }

  volverAtras(tarea: any) {
    if (tarea.estado === 'Completada') {
      tarea.estado = 'En Proceso';
    } else if (tarea.estado === 'En Proceso') {
      tarea.estado = 'Pendiente';
    }
  }
}

