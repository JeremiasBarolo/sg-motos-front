import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatosAdicionalesService } from '../../services/datos-adicionales.service';
import { PersonasService } from '../../services/personas.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-venta-moto-pdf',
  templateUrl: './venta-moto-pdf.component.html',
  styleUrl: './venta-moto-pdf.component.css'
})
export class VentaMotoPdfComponent implements OnInit {
  cardData: any;
  datosAdicionales: any;
  operacion: any
  Persona: any;
  debeChecked: boolean | undefined;
  pagoChecked: boolean | undefined;
  
  @ViewChild('pdfContent', { static: false })
  pdfContent!: ElementRef;
constructor(
  private route: ActivatedRoute,
  private datosAdicionalesService: DatosAdicionalesService,
  private personasService: PersonasService


) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      
      
      this.cardData = { ...params, Moto: JSON.parse(params['Moto']), OperacionesData: JSON.parse(params['OperacionesData']) };
      this.operacion = this.cardData.OperacionesData
      console.log(this.cardData);
      this.setCheckboxes(this.operacion.pago)
      

      if (this.cardData.personaId) {
        this.datosAdicionalesService.getDatosAdicionales(this.cardData.personaId).subscribe((res: any) => {
          this.datosAdicionales = {...res, seniaOperacion: res.señaOperacion, precioOperacion: this.cardData.subtotal };
          
        });

        this.personasService.getById(this.cardData.personaId).subscribe((res: any) => {
          this.Persona = res;
          console.log(this.Persona);
        });
      } else {
        console.error('No recepcionistaId found');
      }
    });

    
  }

  generatePDF(): void {
    const data = this.pdfContent.nativeElement;
    const titles = data.querySelectorAll('h3, h5, h6'); 
    titles.forEach((title: HTMLElement) => {
      title.classList.add('pdf-title');
    });
  
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4'); // Tamaño A4
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`venta-${this.cardData.Moto.modelo}-${this.Persona.nombre}${this.Persona.apellido}.pdf`);
  
      
      titles.forEach((title: HTMLElement) => {
        title.classList.remove('pdf-title');
      });
    });
  }

  setCheckboxes(pago:any): void {
    
    if(pago === 'SI'){
      this.pagoChecked = true;
    }else{
      this.debeChecked = true;
    }
    
    
  }

}
