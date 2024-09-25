import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-card',
  templateUrl: './inicio-card.component.html',
  styleUrl: './inicio-card.component.css'
})
export class InicioCardComponent  {

  constructor(private router: Router) { }
  
  @Input() titulo: any
  @Input() descripcion: any
  @Input() icono: any
  @Input() color: any
  @Input() tooltip: any
  @Input() useCurrencyPipe: boolean = false;
  @Input() url: any;


  redirectTo(url:any){
    this.router.navigate([url]);
  }
  
  
  
}
