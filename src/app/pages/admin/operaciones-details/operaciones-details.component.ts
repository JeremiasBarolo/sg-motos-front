import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosAdicionalesService } from '../../../services/datos-adicionales.service';
import { Subject, takeUntil } from 'rxjs';
import { faker } from '@faker-js/faker';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { OperacionVentaMotoService } from '../../../services/operacion-venta-moto.service';
@Component({
  selector: 'app-operaciones-details',
  templateUrl: './operaciones-details.component.html',
  styleUrl: './operaciones-details.component.css'
})
export class OperacionesDetailsComponent {
  insumoForm: FormGroup;
  isEditMode: any
  id: string | undefined
  form: any;
  tipo: any;
  subtotal:number = 0
  private destroy$ = new Subject<void>();
  editId: any;
  valorCuotas: any;
  dias: number[] = [];
  meses: string[] = [];
  years: number[] = [];
  cantidadCuota: any;
  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private operacionVentaMotoService: OperacionVentaMotoService,
    private location: Location
  
  ) {
    this.insumoForm = this.fb.group({
      seniaOperacion: [''],
      entregaOperacion: [''],
      otrasEntOperacion: [''],
      observacionOperacion: [''],
      cuotas: [1, Validators.required],
      diaVencimientoCuota: [''],
      diaInicioCuota: [''],
      mesInicioCuota: [''],
      anioInicioCuota: [''],
      diaFinalCuota: [''],
      mesFinalCuota: [''],
      anioFinalCuota: [''],
      lugarPago: [''],
      gastosPap: [''],
      prenda: [''],
      inscripcion: [''],
      pago: [''],

      conceptoFinal: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.tipo = params['tipo']; 
      this.subtotal = params['subtotal']; 
      console.log(this.id); 
    });
  
  
    if (this.tipo == 'editar') {
      this.cargarDatos();
      
    }

    this.insumoForm.get('diaVencimientoCuota')?.valueChanges.subscribe(value => {
      if (value) {
        this.cantidadCuota = value
        this.insumoForm.patchValue({
          diaInicioCuota: value,
          diaFinalCuota: value
        });
      }
    });

    this.generateDias()
    this.generateMeses();
    this.generateYears();
  }

  onSubmit() {
    this.tipo = this.insumoForm.value
    

      if(this.isEditMode){
            // Es editar
            try {
              this.operacionVentaMotoService.update(this.editId, {...this.tipo, movimientoId: this.id, valorCuota: this.valorCuotas  }).pipe(takeUntil(this.destroy$)).subscribe(() => {
                setTimeout(() => {
                  this.location.back();  
                }, 600);
              });

            } catch (error) {
              console.log(error);
            }
      }else{
        // Es crear
        try {
          this.operacionVentaMotoService.create({...this.tipo, movimientoId: this.id, valorCuota: this.valorCuotas }).pipe(takeUntil(this.destroy$)).subscribe(() => {
            setTimeout(() => {
              this.location.back();  
            }, 600);
          });
          
        } catch (error) {
          console.log(error);
        }
      }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fillFormWithRandomData() {
    this.insumoForm.patchValue({
      precioOperacion: faker.finance.amount(),
      seniaOperacion: faker.finance.amount(),
      entregaOperacion: faker.finance.amount(),
      otrasEntOperacion: faker.finance.amount(),
      observacionOperacion: faker.lorem.sentence(),
      cuotas: faker.datatype.number({ min: 1, max: 60 }),
      valorCuota: faker.finance.amount(),
      diaVencimientoCuota: faker.datatype.number({ min: 1, max: 28 }),
      diaInicioCuota: faker.datatype.number({ min: 1, max: 28 }),
      mesInicioCuota: faker.date.month(),
      anioInicioCuota: faker.datatype.number({ min: 2021, max: 2024 }),
      diaFinalCuota: faker.datatype.number({ min: 1, max: 28 }),
      mesFinalCuota: faker.date.month(),
      anioFinalCuota: faker.datatype.number({ min: 2021, max: 2024 }),
      lugarPago: faker.address.city(),
      gastosPap: faker.finance.amount(),
      prenda: faker.finance.amount(),
      inscripcion: faker.finance.amount(),
      pago: 'SI',
      fechaRealizacion: faker.date.past().toISOString().split('T')[0],
      conceptoFinal: faker.lorem.paragraph()
    });
  }

  cargarDatos(){
    this.operacionVentaMotoService.getDatosOperacion(this.id).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.editId = data.id
      this.insumoForm.patchValue(data);
      this.isEditMode = true
    });
  }

  valorCuota(): string {
    const cuotas = this.insumoForm.get('cuotas')?.value;
    
    let subtotal = cuotas ? (this.subtotal / cuotas).toFixed(2) : '0.00';
    this.valorCuotas = subtotal
    return subtotal;
    
  }
 
  generateDias() {
    for (let i = 1; i <= 31; i++) {
      this.dias.push(i);
    }
  }
  generateMeses() {
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.meses = nombresMeses;
  }

  generateYears() {
    for (let i = 2020; i <= 2030; i++) {
      this.years.push(i);
    }
  }
}