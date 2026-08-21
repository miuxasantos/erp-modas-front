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
import { CorApiService } from "@core/services/apoio/cor-api.service";
import { CorResponseDto } from "@core/dtos/apoio/cor/cor-response.dto";
import { TemPermissaoDirective } from "@core/directives/tem-permissao.directive";

@Component({
    selector: 'app-cor-list',
    imports: [
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TagModule,
        PageHeaderComponent,
        TemPermissaoDirective
    ],
    templateUrl: './cor-list.component.html'
})

export class CorListComponent implements OnInit {
    private readonly corApi = inject(CorApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    cores: CorResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    corEditando: CorResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        {label: 'Dashboard', routerLink: '/dashboard'},
        {label: 'Cores'},
    ];

    form = this.fb.group({
        nome: ['', Validators.required],
        codigoHex: ['', Validators.required],
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.corApi.getAll().subscribe({
            next: cores => this.cores = cores,
        });
    }

    abrirNovo(): void {
        this.corEditando = null;
        this.form.reset();
        this.dialogVisivel.set(true);
    }

    abrirEdicao(cor: CorResponseDto): void {
        this.corEditando = cor;
        this.form.patchValue(cor);
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
        const request$ = this.corEditando ? this.corApi.update(this.corEditando.id, dto) 
            : this.corApi.create(dto);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.corEditando ? 'Cor atualizada com sucesso!' 
                        : 'Cor criada com sucesso!',
                });
                this.fecharDialog();
                this.carregar();
                this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/cores', id]);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta cor?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.corApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Cor excluída com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}