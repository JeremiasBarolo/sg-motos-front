import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup


  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {

    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
   }
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
    
        const isLoginPage = event.url.includes('login');
        const isRootPage = event.url === '' || event.url === '/';
        if(isLoginPage || isRootPage){
          this.router.navigate(['login'])
        }
       
      }
    });
  }

  login(): void {

    const userData = this.loginForm.value;

    this.authService.login(userData).subscribe(
      (data) => {
        localStorage.setItem('token', data.token);
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/inicio']);
          setTimeout(() => {
            window.location.reload();
          }, 1100);
        } else {
          this.router.navigate(['/empleados']);
          setTimeout(() => {
            window.location.reload();
          }, 1100);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido!',
          detail: 'Acabas de iniciar Sesion en SG-Motos',
          life: 10000
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: `${error.error.message}`,
          life: 10000
        });
        console.error(error);
      }
        
        
    );
  }
}