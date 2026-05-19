// layout/public-layout/footer/footer-public.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-public',
  imports: [RouterLink],
  templateUrl: './public-footer.component.html',
})
export class FooterPublicComponent {
  ano = new Date().getFullYear();
}