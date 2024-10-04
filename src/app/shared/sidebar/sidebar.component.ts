import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import MetisMenu from 'metismenujs';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSidebarCollapsed = false;
  nombre: any
  rol:any
  isAdmin: any;
  openSubMenus: { [key: string]: boolean } = {};
  constructor(
    private router: Router,
    private authService: AuthService,
    private sidebarService: SidebarService
  ){
    this.sidebarService.sidebarCollapsed$.subscribe(
      (collapsed) => (this.isSidebarCollapsed = collapsed)
    );
  }

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
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed
  }

  toggleSubMenu(menu: string) {
    this.toggleSidebar()
    this.openSubMenus[menu] = !this.openSubMenus[menu];
  }

  isSubMenuOpen(menu: string): boolean {
    this.toggleSidebar()
    return this.openSubMenus[menu] || false;

  }

  showDropdown: boolean = false;

  toggleDropdown(event: MouseEvent): void {
    event.preventDefault(); // Evita que el enlace recargue la página
    this.showDropdown = !this.showDropdown;
  }


  

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-user-setting')) {
      this.showDropdown = false; // Cerrar el menú si se hace clic fuera
    }
  }


  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
