import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
  id: number = 0

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

    this.rolesService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'descripcion', header: 'Descripcion' },
        { field: 'isAdmin', header: 'Es Admin?' },
      ];

      data.map((data)=>{
        console.log(data);
        
        this.products.push({
          id: data.id,
          descripcion: data.descripcion,
          isAdmin: this.isAdmin(data.isAdmin),
        })
      })
    })

   
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
          this.rolesService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
            setTimeout(() => {
              window.location.reload();
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
    this.rolesService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000)
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

