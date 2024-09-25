import { Component, OnInit } from '@angular/core';
import { TipoArticuloService } from '../../../services/tipo-articulo.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tipo-articulo',
  templateUrl: './tipo-articulo.component.html',
  styleUrl: './tipo-articulo.component.css'
})
export class TipoArticuloComponent implements OnInit{
  

  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false
  editEliminar: boolean = false
  crearVisible: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0

  private destroy$ = new Subject<void>();




  constructor( 
    private tipoArticuloService: TipoArticuloService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
  ){

    this.form = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {

    this.tipoArticuloService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'descripcion', header: 'Descripcion' },
      ];

      data.map((data)=>{
        this.products.push({
          id: data.id,
          descripcion: data.descripcion
        })
      })
    })

   
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
              this.tipoArticuloService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
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
          this.tipoArticuloService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    this.tipoArticuloService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000)
      // this.router.navigate(['dashboard/insumos']);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  

}
