import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    LoginComponent,

    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    IonicModule
  ]
})
export class AuthModule { }
