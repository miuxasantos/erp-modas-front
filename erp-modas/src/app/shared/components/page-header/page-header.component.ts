// shared/components/page-header/page-header.component.ts
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-page-header',
  imports: [ButtonModule, BreadcrumbModule],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  // inputs — o componente pai passa esses valores
  titulo          = input.required<string>();        // obrigatório
  breadcrumbs     = input.required<MenuItem[]>();    // obrigatório
  botaoLabel      = input<string>('');               // opcional
  botaoIcone      = input<string>('pi pi-plus');     // opcional, padrão +
  botaoVisivel    = input<boolean>(true);            // opcional, padrão visível

  // evento emitido ao clicar no botão
  botaoClick = output<void>();
}