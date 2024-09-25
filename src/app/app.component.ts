import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showSidebar = true;
  showHeader = true;
  isLogged:boolean

  constructor(private router: Router, private authService: AuthService) {
    this.isLogged = this.authService.isLoggedIn()

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        
        const isLoginPage = event.url.includes('/login') 
        this.showSidebar = !isLoginPage;
        this.showHeader = !isLoginPage;

        if(!this.isLogged){
          this.showSidebar = this.isLogged
          this.showHeader = this.isLogged
          this.router.navigate(['/login'])
        }
      }
    });
  }
  ngOnInit(): void {
    
  }

  
}