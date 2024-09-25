import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MotosService } from '../../../services/motos.service';
import { TipoMotosService } from '../../../services/tipo-motos.service';
import { MarcaService } from '../../../services/marca.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-motos-nuevas',
  templateUrl: './motos-nuevas.component.html',
  styleUrl: './motos-nuevas.component.css'
})
export class MotosNuevasComponent {

  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false
  editEliminar: boolean = false
  crearVisible: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  tipoMotos: any[] = [];
  marcas: any[] = [];
  isAdmin: any;

  private destroy$ = new Subject<void>();




  constructor( 
    private motosService: MotosService,
    private marcaService: MarcaService,
    private tipoMotoService: TipoMotosService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private authService: AuthService
  ){

    this.form = this.fb.group({
      modelo: ['', Validators.required],
      year: ['', Validators.required],
      num_motor: ['', Validators.required],
      num_cuadro: ['', Validators.required],
      cilindrada: ['', Validators.required],
      cert_num_fabrica: ['', Validators.required],
      precio: ['', Validators.required],
      marcaId: ['', Validators.required],
      
      
    });
  }
  
  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();
    this.motosService.getAllNuevas().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'Marca', header: 'Marca'},
        { field: 'modelo', header: 'Modelo' },
        { field: 'year', header: 'Año' },
        { field: 'num_motor', header: 'Numero de Motor' },
        { field: 'num_cuadro', header: 'Numero de Cuadro' },
        { field: 'cilindrada', header: 'Cilindrada' },
        { field: 'cert_num_fabrica', header: 'Cert. Num. Fabrica' },
        { field: 'precio', header: 'Precio' },
        
        
      ];

      data.map((data)=>{
         console.log();
         
        this.products.push({
          id: data.id,
          Marca: data.Marca,
          modelo: data.modelo,
          year: data.year,
          num_motor: data.num_motor,
          num_cuadro: data.num_cuadro,
          cilindrada: data.cilindrada,
          cert_num_fabrica: data.cert_num_fabrica,
          precio: data.precio,
          TipoMoto: data.TipoMoto,
          marcaId: data.marcaId
        })
      })
    })

    

    this.marcaService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.marcas = data;
    })

   
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editarItem(data:any) {
    this.editVisible = true
    this.id = data.id
    console.log('data',data);
    
    
    this.form.patchValue({
      modelo: data.modelo,
      year: data.year,
      num_motor: data.num_motor,
      num_cuadro: data.num_cuadro,
      cilindrada: data.cilindrada,
      cert_num_fabrica: data.cert_num_fabrica,
      precio: data.precio,
      marcaId: data.marcaId,
      tipoMotoId: data.tipoMotoId
    })
    
    
    
    
  }

  eliminarItem(data:any) {
    this.editEliminar = true
    this.id = data.id
  }
  
  onSubmit(){

    this.tipo = {
      modelo: this.form.value.modelo,
      year: this.form.value.year,
      num_motor: this.form.value.num_motor,
      num_cuadro: this.form.value.num_cuadro,
      cilindrada: this.form.value.cilindrada,
      cert_num_fabrica: this.form.value.cert_num_fabrica,
      precio: this.form.value.precio,
      marcaId: this.form.value.marcaId,
      tipoMotoId: 2
      
    }

      if(this.id > 0){
            // Es editar
            try {
              this.motosService.update(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
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
          this.motosService.create(this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    this.motosService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000)
      // this.router.navigate(['dashboard/insumos']);
    });
  }

}
