import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { TablangComponent } from './tablang/tablang.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatosServicioPdfComponent } from './datos-servicio-pdf/datos-servicio-pdf.component';
import { TooltipModule } from 'primeng/tooltip';
import { InicioCardComponent } from './inicio-card/inicio-card.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TareasAdminComponent } from './tareas-admin/tareas-admin.component';
import { PaginatorModule } from 'primeng/paginator';

import { VentaMotoPdfComponent } from './venta-moto-pdf/venta-moto-pdf.component';




@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    TablangComponent,
    DatosServicioPdfComponent,
    InicioCardComponent,
    BarChartComponent,
    TareasAdminComponent,
    VentaMotoPdfComponent,
    
  ],
  imports: [
    CommonModule,
    IonicModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    PaginatorModule,
    
    
    
  ],
  exports:[
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    TablangComponent,
    InicioCardComponent,
    BarChartComponent,
    TareasAdminComponent,
    VentaMotoPdfComponent,

    
    

  ]
})
export class SharedModule { }
