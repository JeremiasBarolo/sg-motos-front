import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { AdminComponent } from './admin.component';
import { TipoArticuloComponent } from './tipo-articulo/tipo-articulo.component';
import { TipoPersonaComponent } from './tipo-persona/tipo-persona.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { TipoMovimientosComponent } from './tipo-movimientos/tipo-movimientos.component';
import { RolesComponent } from './roles/roles.component';
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
import { VentaMotosComponent } from './venta-motos/venta-motos.component';
import { HistorialClientesComponent } from './historial-clientes/historial-clientes.component';
import { PedidosStockComponent } from './pedidos-stock/pedidos-stock.component';
import { DatosServicioPdfComponent } from '../../shared/datos-servicio-pdf/datos-servicio-pdf.component';
import { ListadoPreciosComponent } from './listado-precios/listado-precios.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { AsignarInsumosComponent } from './asignar-insumos/asignar-insumos.component';
import { InicioComponent } from './inicio/inicio.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { InsumosComponent } from './insumos/insumos.component';
import { AdminGuard } from '../../auth/admin-guard/admin-guard.component';
import { TareasComponent } from './tareas/tareas.component';
import { MotosConsignacionComponent } from './motos-consignacion/motos-consignacion.component';
import { VentaGeneralComponent } from './venta-general/venta-general.component';
import { AsignarAdicionalesComponent } from './asignar-adicionales/asignar-adicionales.component';
import { VentaMotoPdfComponent } from '../../shared/venta-moto-pdf/venta-moto-pdf.component';
import { OperacionesDetailsComponent } from './operaciones-details/operaciones-details.component';








const routes: Routes = [
  {
    path: '', component: AdminComponent,
    canActivate: [AdminGuard], 
    
    children: [
      { path: 'admin', component: AdminComponent },
      { path: 'tipo-articulo', component: TipoArticuloComponent },
      { path: 'tipo-personas', component: TipoPersonaComponent },
      { path: 'localidades', component: LocalidadesComponent },
      { path: 'tipo-movimientos', component: TipoMovimientosComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'personas', component: PersonasComponent },
      { path: 'empleados', component: EmpleadosComponent },
      { path: 'stock', component: StockComponent },
      { path: 'motos', component: MotosComponent },
      { path: 'motos-usadas', component: MotosUsadasComponent },
      { path: 'motos-nuevas', component: MotosNuevasComponent },
      { path: 'motos-consignacion', component: MotosConsignacionComponent },
      { path: 'tipo-motos', component: TipoMotosComponent },
      { path: 'marcas', component: MarcaComponent },
      { path: 'service', component: DatosServicioComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'insumos', component: InsumosComponent },
      { path: 'proveedor', component: ProveedoresComponent },
      { path: 'ventas/:tipo', component: VentaGeneralComponent },
      { path: 'pdfVenta', component: VentaMotoPdfComponent },
      { path: 'adicionales/:tipo/:id', component: AsignarAdicionalesComponent },
      { path: 'operacion/:tipo/:subtotal/:id', component: OperacionesDetailsComponent },
      { path: 'venta-motos', component: VentaMotosComponent },
      { path: 'historial-clientes', component: HistorialClientesComponent },
      { path: 'pedidos-stock', component: PedidosStockComponent },
      { path: 'service-pdf', component: DatosServicioPdfComponent },
      { path: 'listado-precios', component: ListadoPreciosComponent },
      { path: 'asignar-insumos/:id', component: AsignarInsumosComponent },
      { path: 'asignar-insumos/editar/:id', component: AsignarInsumosComponent },
      { path: 'tareas', component: TareasComponent },
      { path: 'inicio', component: InicioComponent, canActivate: [AdminGuard],  },
      { path: '**', redirectTo: 'inicio' }, 
    ]
  },
  

    


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),


  ],

  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
