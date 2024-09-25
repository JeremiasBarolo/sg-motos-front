import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isAdmin: any;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();
   
  
    console.log('admin:',this.isAdmin);
    
  }
}
