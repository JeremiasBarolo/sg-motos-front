import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isSidebarCollapsed = false;
  nombre: any
  rol:any
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService
  ) { }


  ngOnInit(): void {
    this.authService.getUserData().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      if(data.nombre === 'Admin Admin'){
        this.nombre = 'Admin';
      }else{
        this.nombre = data.nombre;
      }
      this.rol = data.rol;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
}


