import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonasService } from '../../services/personas.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-datos-servicio-pdf',
  templateUrl: './datos-servicio-pdf.component.html',
  styleUrls: ['./datos-servicio-pdf.component.css']
})
export class DatosServicioPdfComponent implements OnInit {
  cardData: any;
  recepcionista: any;


  @ViewChild('pdfContent', { static: false })
  pdfContent!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private personasService: PersonasService,
    
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      
      
      this.cardData = { ...params, Servicios: JSON.parse(params['Servicios']), Checklist: JSON.parse(params['Checklist']) };
      console.log(this.cardData);
      

      if (this.cardData.personaId) {
        this.personasService.getById(this.cardData.personaId).subscribe((res: any) => {
          this.recepcionista = res;
          console.log(this.recepcionista);
        });
      } else {
        console.error('No recepcionistaId found');
      }
    });

    this.marcarCheckboxes(this.cardData.Checklist)
    this.marcarTipoServicio(this.cardData.tipo_servicio)
    
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
      pdf.save(`servicio-${this.cardData.modelo}-${this.cardData.fecha_est_entrega}.pdf`);
  
      
      titles.forEach((title: HTMLElement) => {
        title.classList.remove('pdf-title');
      });
    });
  }

  marcarCheckboxes(checklistOptions: any) {
  
    setTimeout(() => {
      checklistOptions.forEach((option: { id: any; }) => {
        const checkbox = document.getElementById(`${option.id}`) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }, 0);
  }

  marcarTipoServicio(tipoServicio: string) {
    setTimeout(() => {
      const checkbox = document.getElementById(tipoServicio) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = true;
      }
    }, 0);
  }


  CalcularSubtotalFinal(subtotal: any){
    const incremento = subtotal * 0.25;
    const subtotalFinal = parseInt(subtotal, 10) + incremento;
    return subtotalFinal;
  }

  ManoDeObra(subtotal: number){
    const incremento = subtotal * 0.25;
    return incremento;
  }

}


