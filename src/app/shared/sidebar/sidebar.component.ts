import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import MetisMenu from 'metismenujs';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  nombre: any;
  rol: any;
  isAdmin: any;
  showDropdown = false;
  isSidebarToggled = false;

  private metisMenu?: MetisMenu;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();
    this.isSidebarToggled =
      document.querySelector('.wrapper')?.classList.contains('toggled') ?? false;

    this.authService.getUserData().subscribe((data) => {
      if (!data) {
        return;
      }
      this.nombre = data.nombre === 'Admin Admin' ? 'Admin' : data.nombre;
      this.rol = data.rol;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMetisMenu(), 0);
  }

  ngOnDestroy(): void {
    this.metisMenu?.dispose();
  }

  private initMetisMenu(): void {
    const menu = document.querySelector('#menu');
    if (!menu) {
      return;
    }
    this.metisMenu?.dispose();
    this.metisMenu = new MetisMenu('#menu', { toggle: true });
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
    const wrapper = document.querySelector('.wrapper');
    wrapper?.classList.toggle('toggled');
    this.isSidebarToggled = wrapper?.classList.contains('toggled') ?? false;
  }

  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.showDropdown = false;
    }
  }

  logout() {
    this.showDropdown = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
