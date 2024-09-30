import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  showSidebar = true;
  showHeader = true;
 

  constructor(private router: Router, private authService: AuthService) {
    

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        
        const isLoginPage = event.url.includes('/login') 
        this.showSidebar = !isLoginPage;
        this.showHeader = !isLoginPage;

       
      }
    });
  }
  ngOnInit(): void {
    
  }

  
}
