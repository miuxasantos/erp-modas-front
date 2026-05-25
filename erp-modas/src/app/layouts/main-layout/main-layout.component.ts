import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "../sidebar/sidebar-layout.component";
import { TopbarComponent } from "../topbar/topbar.component";
import { FooterComponent } from "../footer/footer-layout.component";
import { NgClass } from "@angular/common";

@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, SidebarComponent, TopbarComponent, FooterComponent],
    templateUrl: './main-layout.component.html',
})

export class MainLayoutComponent {
    sidebarVisivel = signal(false);

    abrirSidebar(): void {
        this.sidebarVisivel.set(true);
    }

    fecharSidebar(): void {
        this.sidebarVisivel.set(false);
    }
}