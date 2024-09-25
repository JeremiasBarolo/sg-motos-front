import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { TipoArticuloComponent } from './tipo-articulo/tipo-articulo.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TipoPersonaComponent } from './tipo-persona/tipo-persona.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { TipoMovimientosComponent } from './tipo-movimientos/tipo-movimientos.component';
import { RolesComponent } from './roles/roles.component';
import { TooltipModule } from 'primeng/tooltip';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PersonasComponent } from './personas/personas.component';
import { StockComponent } from './stock/stock.component';
import { MotosComponent } from './motos/motos.component';
import { TipoMotosComponent } from './tipo-motos/tipo-motos.component';
import { MarcaComponent } from './marca/marca.component';
import { DatosServicioComponent } from './datos-servicio/datos-servicio.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { MotosNuevasComponent } from './motos-nuevas/motos-nuevas.component';
import { MotosUsadasComponent } from './motos-usadas/motos-usadas.component';
import { PickListModule } from 'primeng/picklist';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { VentaMotosComponent } from './venta-motos/venta-motos.component';
import { DropdownModule } from 'primeng/dropdown';
import { HistorialClientesComponent } from './historial-clientes/historial-clientes.component';
import { PedidosStockComponent } from './pedidos-stock/pedidos-stock.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListadoPreciosComponent } from './listado-precios/listado-precios.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { AsignarInsumosComponent } from './asignar-insumos/asignar-insumos.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InicioComponent } from './inicio/inicio.component';
import { IonicModule } from '@ionic/angular';
import { ServiciosComponent } from './servicios/servicios.component';
import { InsumosComponent } from './insumos/insumos.component';
import { TareasComponent } from './tareas/tareas.component';
import { CalendarModule } from 'primeng/calendar';
import { MotosConsignacionComponent } from './motos-consignacion/motos-consignacion.component';
import { VentaGeneralComponent } from './venta-general/venta-general.component';
import { AsignarAdicionalesComponent } from './asignar-adicionales/asignar-adicionales.component';
import { StepperModule } from 'primeng/stepper';
import { MessageService } from 'primeng/api';
import { OperacionesDetailsComponent } from './operaciones-details/operaciones-details.component';



@NgModule({
  declarations: [
    AdminComponent,
    TipoArticuloComponent,
    TipoPersonaComponent,
    LocalidadesComponent,
    TipoMovimientosComponent,
    RolesComponent,
    UsuariosComponent,
    PersonasComponent,
    StockComponent,
    MotosComponent,
    TipoMotosComponent,
    MarcaComponent,
    DatosServicioComponent,
    ClientesComponent,
    ProveedoresComponent,
    MotosNuevasComponent,
    MotosUsadasComponent,
    VentaMotosComponent,
    HistorialClientesComponent,
    PedidosStockComponent,
    ListadoPreciosComponent,
    EmpleadosComponent,
    AsignarInsumosComponent,
    InicioComponent,
    ServiciosComponent,
    InsumosComponent,
    TareasComponent,
    MotosConsignacionComponent,
    VentaGeneralComponent,
    AsignarAdicionalesComponent,
    OperacionesDetailsComponent


   
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    AdminRoutingModule,
    SharedModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    TooltipModule,
    PickListModule,
    DragDropModule,
    DropdownModule,
    MultiSelectModule,
    FormsModule,
    TableModule,
    ToastModule,
    IonicModule,
    CalendarModule,
    StepperModule
    
    
  
  ],
  providers: [MessageService]
})
export class AdminModule { }
