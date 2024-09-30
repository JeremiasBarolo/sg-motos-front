import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import MetisMenu from 'metismenujs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isAdmin: any;
  openSubMenus: { [key: string]: boolean } = {};
  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  ngAfterViewInit() {
    const metisMenu = new MetisMenu('#menu'); 
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();
   
  
    console.log('admin:',this.isAdmin);
    
  }

  toggleSubMenu(menu: string) {
    // Alterna la apertura del submenú
    this.openSubMenus[menu] = !this.openSubMenus[menu];
  }

  isSubMenuOpen(menu: string): boolean {
    // Devuelve si el submenú está abierto
    return this.openSubMenus[menu] || false;
  }
}
