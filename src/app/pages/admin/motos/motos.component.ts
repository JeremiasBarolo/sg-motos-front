import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MotosService } from '../../../services/motos.service';
import { TipoMotosService } from '../../../services/tipo-motos.service';
import { MarcaService } from '../../../services/marca.service';
import { AuthService } from '../../../services/auth.service';
import { mapPaginatedResponse, PageChangeEvent } from '../../../models/paginated-response';

@Component({
  selector: 'app-motos',
  templateUrl: './motos.component.html',
  styleUrl: './motos.component.css',
})
export class MotosComponent implements OnInit, OnDestroy {
  isAdmin: any;
  products: any[] = [];
  columns: any[] = [];
  editVisible = false;
  editEliminar = false;
  crearVisible = false;
  form: FormGroup;
  tipo: any;
  id = 0;
  tipoMotos: any[] = [];
  marcas: any[] = [];
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  serverSide = true;

  private destroy$ = new Subject<void>();

  constructor(
    private motosService: MotosService,
    private marcaService: MarcaService,
    private tipoMotoService: TipoMotosService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      modelo: ['', Validators.required],
      year: ['', Validators.required],
      num_motor: ['', Validators.required],
      num_cuadro: ['', Validators.required],
      cilindrada: ['', Validators.required],
      cert_num_fabrica: ['', Validators.required],
      precio: ['', Validators.required],
      marcaId: ['', Validators.required],
      tipoMotoId: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();
    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'Marca', header: 'Marca' },
      { field: 'modelo', header: 'Modelo' },
      { field: 'year', header: 'Año' },
      { field: 'num_motor', header: 'Numero de Motor' },
      { field: 'num_cuadro', header: 'Numero de Cuadro' },
      { field: 'cilindrada', header: 'Cilindrada' },
      { field: 'color', header: 'Color' },
      { field: 'cert_num_fabrica', header: 'Cert. Num. Fabrica' },
      { field: 'precio', header: 'Precio' },
      { field: 'TipoMoto', header: 'Estado' },
    ];
    this.loadPage({ page: 0, size: this.pageSize });

    this.tipoMotoService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tipoMotos = data;
    });

    this.marcaService.getAll().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.marcas = data;
    });
  }

  loadPage(event: PageChangeEvent): void {
    this.loading = true;
    this.pageSize = event.size;
    this.motosService
      .getPage(event.page, event.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mapped = mapPaginatedResponse(response, (data) => ({
            id: data.id,
            Marca: data.Marca,
            modelo: data.modelo,
            year: data.year,
            num_motor: data.num_motor,
            num_cuadro: data.num_cuadro,
            cilindrada: data.cilindrada,
            color: data.color,
            cert_num_fabrica: data.cert_num_fabrica,
            precio: data.precio,
            TipoMoto: data.TipoMoto,
            tipoMotoId: data.tipoMotoId,
            marcaId: data.marcaId,
          }));
          this.products = mapped.items;
          this.totalRecords = mapped.totalRecords;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editarItem(data: any) {
    this.editVisible = true;
    this.id = data.id;
    this.form.patchValue({
      modelo: data.modelo,
      year: data.year,
      num_motor: data.num_motor,
      num_cuadro: data.num_cuadro,
      cilindrada: data.cilindrada,
      cert_num_fabrica: data.cert_num_fabrica,
      precio: data.precio,
      marcaId: data.marcaId,
      tipoMotoId: data.tipoMotoId,
      color: data.color,
    });
  }

  eliminarItem(data: any) {
    this.editEliminar = true;
    this.id = data.id;
  }

  onSubmit() {
    this.tipo = {
      modelo: this.form.value.modelo,
      year: this.form.value.year,
      num_motor: this.form.value.num_motor,
      num_cuadro: this.form.value.num_cuadro,
      cilindrada: this.form.value.cilindrada,
      cert_num_fabrica: this.form.value.cert_num_fabrica,
      precio: this.form.value.precio,
      marcaId: this.form.value.marcaId,
      tipoMotoId: this.form.value.tipoMotoId,
      color: this.form.value.color,
    };

    if (this.id > 0) {
      this.motosService
        .update(this.id, this.tipo)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadPage({ page: 0, size: this.pageSize }));
    } else {
      this.motosService
        .create(this.tipo)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadPage({ page: 0, size: this.pageSize }));
    }
  }

  Eliminar() {
    this.motosService
      .delete(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadPage({ page: 0, size: this.pageSize }));
  }
}
