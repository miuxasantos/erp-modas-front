// layout/public-layout/public-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarPublicComponent } from './public-navbar/public-navbar.component';
import { FooterPublicComponent } from './public-footer/public-footer.component';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, NavbarPublicComponent, FooterPublicComponent],
  templateUrl: './public-layout.component.html',
})
export class PublicLayoutComponent {
    
}