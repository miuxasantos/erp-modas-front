// layout/public-layout/navbar/navbar-public.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LOJA, linkWhatsapp } from '@core/const/public.constant';

@Component({
  selector: 'app-navbar-public',
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './public-navbar.component.html',
})
export class NavbarPublicComponent {
  readonly loja = LOJA;
  readonly whatsapp = linkWhatsapp();
}