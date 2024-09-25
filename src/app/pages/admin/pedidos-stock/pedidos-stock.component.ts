import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from '../../../services/personas.service';
import { StockService } from '../../../services/stock.service';
import { TipoArticuloService } from '../../../services/tipo-articulo.service';
import { PedidosService } from '../../../services/pedidos.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pedidos-stock',
  templateUrl: './pedidos-stock.component.html',
  styleUrl: './pedidos-stock.component.css',
  providers: [DatePipe]
})
export class PedidosStockComponent {
  products: any[] = [];
  columns: any[] = [];
  editVisible: boolean = false
  editEliminar: boolean = false
  crearVisible: boolean = false
  cantidadVisible: boolean = false
  detailModal: boolean = false
  form: FormGroup;
  tipo: any;
  cardData: any;
  id: number = 0;
  proveedores: any[] = [];
  tipoArticulos: any[] = [];
  options: any[] = [];
  Articulos:any[] = []
  selectedEntities: any[] = [];
  

  private destroy$ = new Subject<void>();




  constructor( 
    private stockService: StockService,
    private pedidosService: PedidosService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private messageService: MessageService,
    private datePipe: DatePipe
  ){

    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      productos: this.fb.array([]) 
    });
  }
  
  ngOnInit(): void {

    this.pedidosService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'id', header: 'ID' },
        { field: 'descripcion', header: 'Descripcion' },
        { field: 'cantidadPedido', header: 'Cantidad del Pedido' },
        { field: 'FechaRealizacion', header: 'Fecha de Realizacion' },
        { field: 'total', header: 'Costo' },
        { field: 'estado', header: 'Estado' },
        
        

      ];

      let dataSorted = data.sort((a, b) => b.id - a.id)
      dataSorted.map((data)=>{

        this.products.push({
          id: data.id,
          descripcion: data.descripcion,
          estado: data.estado,
          cantidadPedido: data.Pedido.length,
          Pedido: data.Pedido,
          total: data.total,
          FechaRealizacion: this.datePipe.transform(data.FechaRealizacion, 'dd/MM/yy')
        })
      })
    })

    

    this.stockService.getAllStockGeneral().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      console.log('data:',data);
      
      let dataReal = data.map((stock)=>{
        
          return {
            ...stock,
            nombre: stock.nombre_articulo,
            cantidad: 0,
            cantidadActual: stock.cantidad
          }
        
        
      })

      dataReal = dataReal.filter(stock => stock.cantidadActual > 0);

      this.Articulos = dataReal;
      this.options = dataReal;
    })

   
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editarItem(data: any) {
    this.editVisible = true;
    this.id = data.id;
    
    
    this.form.patchValue({
      descripcion: data.descripcion,
    });
  
    
  
    
    this.form.patchValue({
      personaId: data.personaId
    });


    console.log(data);
    
  
    
  
    this.stockService.getAllStockGeneral().subscribe(opciones => {
      
      this.options = opciones
      
      data.Pedido.forEach((item: any) => {
       
        this.selectedEntities.push(item)
        this.options = this.options.filter(option => option.id !== item.id);
        this.options = this.options.map((stock)=>{
          return {
            ...stock,
            nombre: stock.nombre_articulo,
            cantidad: 1,
            cantidadActual: stock.cantidad
          }
        })
      });
    });

    console.log(this.options);
    console.log(this.selectedEntities);
    
    
    
  }

  eliminarItem(data:any) {
    this.editEliminar = true
    this.id = data.id
  }
  
  onSubmit(edit?:any){

    this.tipo = {
      descripcion: this.form.value.descripcion,
      productos: this.selectedEntities,
    }

      if(this.id > 0){
        if(edit){
          this.pedidosService.SumarCantidades(this.id, {estado: 'Finalizado'}).pipe(takeUntil(this.destroy$)).subscribe(() => {
            setTimeout(() => {
              window.location.reload();
            }, 600)
          });
        }else{
          try {
            this.pedidosService.updatePedidoStock(this.id, this.tipo).pipe(takeUntil(this.destroy$)).subscribe(() => {
              setTimeout(() => {
                window.location.reload();
              }, 600)
            });

          } catch (error) {
            console.log(error);
          }
        }
          
      }else{
        try {
          this.pedidosService.create(this.tipo ).pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    this.pedidosService.delete(this.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    });
  }

  // <================================ FUNCIONAMIENTO DE PICKLIST =======================================>
  selectedEntity(entity: any) {
    this.selectedEntities.push({...entity, cantidad: 1});
    this.options = this.options.filter(item => item.id !== entity.id);
  }
  
  returnEntities(entity: any) {
  
    this.options.push(entity);
    this.selectedEntities = this.selectedEntities.filter(item => item.id !== entity.id);
  }
  
  incrementQuantity(item: any): void {
    if (item.cantidad) {
      if (item.cantidad < item.cantidadActual) {
        item.cantidad++;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No hay suficiente stock disponible' });
      }
    } else {
      item.cantidad = 1;
    }
  }
  
  decrementQuantity(item: any): void {
    if (item.cantidad && item.cantidad > 0) {
      item.cantidad--;
    }
  }



    // <================================ FUNCIONAMIENTO DE MODALES =======================================>

    modalOpen(data:any){
      this.detailModal = true
      this.id = data.id
      this.cardData = data
    }

    modalClose(){
      this.detailModal = false
      this.id = 0
      this.cardData = []
    }

    modalCreateClose(total?:any) {
      this.editVisible = false;
      this.crearVisible = false;
      if(total){
        this.Articulos = [...this.options]; 
        this.form.reset({
          descripcion: '',
        });

        this.selectedEntities = []
      }
      
    }
}
