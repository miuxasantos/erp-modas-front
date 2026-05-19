import { Component, inject, OnInit, signal } from "@angular/core";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag"
import { MenuItem } from "primeng/api";
import { TamanhoApiService } from "@core/services/apoio/tamanho-api.service";
import { TamanhoResponseDto } from "@core/dtos/tamanho/tamanho-response.dto";

@Component({
    selector: 'app-tamanho-list',
    imports: [
        TableModule,
        ButtonModule,
        InputTextModule,
        TagModule,
    ],
    templateUrl: './tamanho-list.component.html'
})

export class TamanhoListComponent implements OnInit {
    private readonly tamanhoApi = inject(TamanhoApiService);

    tamanhos: TamanhoResponseDto[] = [];
    
    breadcrumbs: MenuItem[] = [
        {label: 'Dashboard', routerLink: '/dashboard'},
        {label: 'Tamanhos'},
    ];

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.tamanhoApi.getAll().subscribe({
            next: tamanhos => this.tamanhos = tamanhos,
        });
    }
}