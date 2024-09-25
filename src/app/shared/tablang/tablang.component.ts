import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tablang',
  templateUrl: './tablang.component.html',
  styleUrls: ['./tablang.component.css']
})
export class TablangComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() accionesVisible: boolean = true;
  @Input() insumosVisible: boolean = false;
  @Input() adicionalesVisible: boolean = false;
  @Input() operacionesVisible: boolean = false;
  @Input() pdfVisible: boolean = false;

  @Output() editarClick: EventEmitter<any> = new EventEmitter();
  @Output() eliminarClick: EventEmitter<any> = new EventEmitter();
  @Output() insumoClick: EventEmitter<any> = new EventEmitter();
  @Output() adicionalesClick: EventEmitter<any> = new EventEmitter();
  @Output() operacionesClick: EventEmitter<any> = new EventEmitter();
  @Output() modalOpenClick: EventEmitter<any> = new EventEmitter();
  @Output() pdfOpenClick: EventEmitter<any> = new EventEmitter();

  acciones: boolean = true;
  insumos: boolean = false;
  adicionales: boolean = false;
  operaciones: boolean = false;
  pdf: boolean = false;


  isAdmin:any

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnDestroy(): void {
    this.insumos = false;
    this.pdf = false;
    this.adicionales = false;
    this.operaciones = false;
    
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAllowed();
    
    
    this.acciones = this.accionesVisible;
    this.insumos = this.insumosVisible;
    this.adicionales = this.adicionalesVisible;
    this.operaciones = this.operacionesVisible;
    this.pdf = this.pdfVisible;
  }

  ngOnChanges(): void {
    this.acciones = this.accionesVisible;
    this.insumos = this.insumosVisible;
    this.adicionales = this.adicionalesVisible;
    this.operaciones = this.operacionesVisible;
    this.pdf = this.pdfVisible;

  }

  editar(rowData: any) {
    this.editarClick.emit(rowData);
  }

  modalOpen(rowData: any) {
    this.modalOpenClick.emit(rowData);
  }

  eliminar(rowData: any) {
    this.eliminarClick.emit(rowData);
  }

  asignarInsumos(rowData: any) {
    this.insumoClick.emit(rowData);
  }

  asignarAdicionales(rowData: any) {
    this.adicionalesClick.emit(rowData);
  }
  asignarDatosOperacion(rowData: any) {
    this.operacionesClick.emit(rowData);
  }

  pdfClick(rowData: any) {
    this.pdfOpenClick.emit(rowData);
  }
}
