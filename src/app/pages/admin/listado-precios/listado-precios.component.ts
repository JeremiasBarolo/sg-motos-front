import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MovimientosService } from '../../../services/movimientos.service';

@Component({
  selector: 'app-listado-precios',
  templateUrl: './listado-precios.component.html',
  styleUrls: ['./listado-precios.component.css']
})
export class ListadoPreciosComponent implements OnInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  columns: any[] = [];
  showTable = false;
  showDropdownDialog = false;
  movements: any[] = [];
  clientes: any[] = [];
  selectedClient: any;
  searchText: string = '';
  private destroy$ = new Subject<void>();
  tipoArticulosChoice: any[] = [];

  constructor(
    private movimientosService: MovimientosService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.movimientosService.getListadoPrecios().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.columns = [
        { field: 'nombre', header: 'Nombre' },
        { field: 'tipoArticulo', header: 'Tipo Articulo' },
        { field: 'costo', header: 'Costo' },
        { field: 'cantidad', header: 'Cantidad' }
      ];

      const tipoArticulosSet = new Set();

      data.forEach(item => {
        this.products.push({
          id: item.id,
          nombre: item.nombre,
          tipoArticulo: item.tipo_articulo,
          costo: item.costo,
          cantidad: item.cantidad,
          datos: item.datos
        });

        tipoArticulosSet.add(item.tipo_articulo);
      });

      this.filteredProducts = [...this.products];
      this.tipoArticulosChoice = [{ tipo: 'Mostrar Todos' }, ...Array.from(tipoArticulosSet).map(tipo => ({ tipo }))];
    });
  }

  searchClientMovements() {
    let filtered = this.products;

    if (this.selectedClient && this.selectedClient.tipo !== 'Mostrar Todos') {
      filtered = filtered.filter(movement => movement.tipoArticulo === this.selectedClient.tipo);
    }

    if (this.searchText.trim() !== '') {
      filtered = filtered.filter(movement => movement.nombre.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    this.filteredProducts = filtered;
    this.showTable = true;
  }

  showClientDropdown() {
    this.showDropdownDialog = true;
  }

  onClientChange(event: any) {
    this.selectedClient = event.value;
    this.onSearchTextChange();
  }

  onSearchTextChange() {
    if (this.searchText.trim() === '') {
      this.filteredProducts = [...this.products];
      if (this.selectedClient && this.selectedClient.tipo !== 'Mostrar Todos') {
        this.filteredProducts = this.filteredProducts.filter(movement => movement.tipoArticulo === this.selectedClient.tipo);
      }
    } else {
      this.searchClientMovements();
    }
  }
}
