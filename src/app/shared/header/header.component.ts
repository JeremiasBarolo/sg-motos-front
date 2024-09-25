import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  nombre: any
  rol:any
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
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


  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
