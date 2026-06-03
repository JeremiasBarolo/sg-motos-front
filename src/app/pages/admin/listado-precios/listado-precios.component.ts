import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MovimientosService } from '../../../services/movimientos.service';
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';

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
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;

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
    this.columns = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'tipoArticulo', header: 'Tipo Articulo' },
      { field: 'costo', header: 'Costo' },
      { field: 'cantidad', header: 'Cantidad' }
    ];
    this.loadPage({ page: 0, size: this.pageSize });
  }

  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    const tipoArticulosSet = new Set<string>();
    this.movimientosService
      .getPageListadoPrecios(event.page, event.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mapped = mapPaginatedResponse(response, (item) => {
            tipoArticulosSet.add(item.tipo_articulo);
            return {
              id: item.id,
              nombre: item.nombre,
              tipoArticulo: item.tipo_articulo,
              costo: item.costo,
              cantidad: item.cantidad,
              datos: item.datos
            };
          });
          this.products = mapped.items;
          this.totalRecords = mapped.totalRecords;
          this.tipoArticulosChoice = [{ tipo: 'Mostrar Todos' }, ...Array.from(tipoArticulosSet).map(tipo => ({ tipo }))];
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  applyFilters(): void {
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

  searchClientMovements() {
    this.applyFilters();
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
      this.applyFilters();
    } else {
      this.searchClientMovements();
    }
  }
}
