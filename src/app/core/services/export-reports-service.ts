import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';



@Injectable({
  providedIn: 'root'
})
export class ExportReportsService {

  constructor() { }

  exportToPdf(data: any[], fieldName: string = 'reporte_comercios') {
    const doc = new jsPDF();
    const logoBase64 = 'data:image/webp;base64,UklGRhIFAABXRUJQVlA4TAUFAAAvqAAJEMfDKJIkKbncDvBvCA380cCWDUWNJEXVvHCLRnxdjNpIcuSNuJbtwrtvvnZU27ab5Pz0+m8UJBIYogI9DJGANSTEwc2U9gJFP4EKDRJqCAkTEkAD0AJkgAojQI0BoEcDABaAEg1qANCgRQLo0QBMKAEadACgQwtQIj3KOxhkHAicEfCAMDwInDACJxxeMQzDb6uAIAhKCZjsA1E1AXlA5CFgAxAyRFEceML3ntdv7fs1T83xCZeqqsiLRiVTIMKGlajEUNTPS0x7rIn/ZO0cN45AIGl/7CUiIqEVBWvbo8jK96mJRq00dhSJPVx6QCIoCLr/zf1/hqq6C4jo/wRI1rZJUat/lXVyzrVAxQVnlLinIz24Fnr/VQM9RNYR/Z8AfHW/+/nXl/Q3br+cOziv43dNJPnv7dWJDgunxW2wF3c35nL5KpSICkD1IpM4z8zPTw9Xsxdb4Mf5YHYeH819FRR4hSxYu3VX8ONM0hdEVh6DubNTAPBK20OO7SLlFcjD3Rd5CC9Dr7RF7O+Hh7mvMm6NMeb16eGmETo7kzy17Y74dj8VIjpCIFKf7q4CFwlqdwr624oA4OKp0NxNjYioisd15OtDw3eEXgkZ+7SQ3EZfNg5qDeA0X+GGz5lyfrLCDjJk7CB3FYhjBJvIh4Ybr0TFjMzPtiRbh6TEip2lowFAeWQC5X/thIioikcHxrze+A6i4oVZWHq4G3hukoo4A5gEnfam7GgFcYzAiTFv8Ub+ECfkyvLFXG9q8lzGHgjKs3aKFXpNUBWPbox5SNmGYRg+F6pBRKprSgrj1cyhhIqeXFNKq7YBRlkUR9mnYF8cYO0giuLb2+d3Ye618gAA5hCnA+BOseV6r1bZT6q2wjqo7hQ0wCRoRVRs2pmg0hrNxSKB6n8+GmOCusWLnrKD7ARdxiOvzcMwDDP1FRWFQfFAUHqxihXpNSXnpVhWh33I2Ak5GmASJ3Slb1bpm9mcURYAhrIvwL6gi5SOxi3FN/dowRGg3AZ9E/EmIqrM4ziT3OYc3gQtEBRbUlCoqtiJNoOMXj6gJUjf7wqtVvl8A2dAVThYLjqlByaxorSuHSlt1ptAeH376WMDwKxK3yRdbe0NqiJrBXaxAKfoi3CqUEmMtFX0+RlBr0CnTE1isz1NMUZvkS1x1M+0F0VB21HasoqWqwMtVscW69Z4JWmbL7bNImpL3pQ3AwAlRolvYkLlvkLHwEhbIoOQSYIG5Vp3G/+JJHaoJXgT2yG6mrJ2gharA2RgNyUiKosp88rb1f4U/CG3NHBC3VHr5ZUqRsrYulgcYC4P40HVwSrcHhX/2zMAq7ADYB+v8K58/Jihq0PKxSp8iRN0WF3CRW0C8KaUAsCukAdJ1+53hfwHzwo/h2F4KvM5WzX38kRUtxOlj+xOC8DsNRZAzMjQ7vvMX7BaaQa79obqFgpEF+iwnNrsVgtp1woPAGtJbIdX7QsQmgXNt/DyeS9hOU6Q1RqQNfEs6oWZCtIVvvnjf9ED6PZGOEVCdbIEyhUMlCU2tz7GpE+xsyg2YUok9/QcLHT3nBLX9NYZwEfp64BvfxlT+gmye0567L1B1lOGuvkcAJYsW/gTmkXsqO8AgJ2IPn79/unhMmyUodWMmbmP339lPqGFBbrMzH38AZk/XZO27TEzd/EH9LnToWWL5biFv2DIJIemdszMswR/RN/H2Fm0TjqdJjIEAA==';
    doc.addImage(logoBase64, 'PNG', 10, 10, 10, 10);
    doc.setFontSize(14);
    doc.text('Report de Comercios', 50, 20);
    const fecha = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 50, 26);

    const headers = [['DANE', 'Terminal', 'Nombre', 'Ubicación', 'Total TX', 'Total Ventas']];
    const body = data.map(item => [
      item.codeDane,
      item.business_id,
      item.business_name || '',
      `${ item.department || '' } / ${ item.city || '' }`,
      item.total_transacciones,
      `$${item.total_ventas}`
    ]);

    autoTable(doc, {
      head: headers,
      body: body,
      startY: 35,
      styles: { fontSize: 8 },
    });

    doc.save(`${fieldName}.pdf`)

  }
}
