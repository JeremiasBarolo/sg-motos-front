const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/app/services');

const files = [
  'roles.service.ts',
  'localidades.service.ts',
  'tipo-motos.service.ts',
  'tipo-articulo.service.ts',
  'tipo-personas.service.ts',
  'tipo-movimientos.service.ts',
  'tipo-servicio.service.ts',
  'tareas.service.ts',
  'usuarios.service.ts',
  'pedidos.service.ts',
  'operacion-venta-moto.service.ts',
  'datos-servicio.service.ts',
  'datos-adicionales.service.ts',
  'checklist.service.ts',
];

const getPageBlock = `

  getPage(page = 0, size = 10) {
    return getPaginated(this.http, this.apiUrl, page, size, this.getHeaders());
  }
`;

for (const f of files) {
  const fp = path.join(dir, f);
  let c = fs.readFileSync(fp, 'utf8');
  if (c.includes('getPage(page')) {
    console.log('skip', f);
    continue;
  }
  const block = `
  getPage(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, this.apiUrl, page, size, this.getHeaders());
  }
`;
  const m = c.match(/getAll\(\): Observable<any\[\]> \{[\s\S]*?\n  \}/);
  if (!m) {
    console.log('no getAll', f);
    continue;
  }
  const idx = c.indexOf(m[0]) + m[0].length;
  c = c.slice(0, idx) + block + c.slice(idx);
  if (f === 'pedidos.service.ts' && !c.includes('getPagePendientes')) {
    const pend = c.match(/getAllPendientes\(\): Observable<any\[\]> \{[\s\S]*?\n  \}/);
    if (pend) {
      const pidx = c.indexOf(pend[0]) + pend[0].length;
      const pblock = `
  getPagePendientes(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, \`\${this.apiUrl}/pendientes\`, page, size, this.getHeaders());
  }
`;
      c = c.slice(0, pidx) + pblock + c.slice(pidx);
    }
  }
  fs.writeFileSync(fp, c);
  console.log('updated', f);
}
