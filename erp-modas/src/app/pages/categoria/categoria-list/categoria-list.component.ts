import { Component, inject, OnInit, signal } from "@angular/core";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag"
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { CategoriaApiService } from "@core/services/categoria-api.service";
import { CategoriaResponseDto } from "@core/dtos/categoria/categoria-response.dto";

@Component({
    selector: 'app-categoria-list',
    imports: [
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TagModule,
        PageHeaderComponent,
    ],
    templateUrl: './categoria-list.component.html'
})

export class CategoriaListComponent implements OnInit {
    private readonly categoriaApi = inject(CategoriaApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    categorias: CategoriaResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    categoriaEditando: CategoriaResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        {label: 'Dashboard', routerLink: '/dashboard'},
        {label: 'Categorias'},
    ];

    form = this.fb.group({
        nome: ['', Validators.required],
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.categoriaApi.getAll().subscribe({
            next: categorias => this.categorias = categorias,
        });
    }

    abrirNovo(): void {
        this.categoriaEditando = null;
        this.form.reset();
        this.dialogVisivel.set(true);
    }

    abrirEdicao(categoria: CategoriaResponseDto): void {
        this.categoriaEditando = categoria;
        this.form.patchValue(categoria);
        this.dialogVisivel.set(true);
    }

    fecharDialog(): void {
        this.dialogVisivel.set(false);
        this.form.reset();
    }

    salvar(): void {
        if (this.form.invalid) return;
        
        this.salvando.set(true);
        const dto = this.form.getRawValue() as any;
        const request$ = this.categoriaEditando ? this.categoriaApi.update(this.categoriaEditando.id, dto) 
            : this.categoriaApi.create(dto);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.categoriaEditando ? 'Categoria atualizada com sucesso!' 
                        : 'Categoria criada com sucesso!',
                });
                this.fecharDialog();
                this.carregar();
                this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/categorias', id]);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta categoria?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.categoriaApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Categoria excluída com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}