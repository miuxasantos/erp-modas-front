import { Component, inject, OnInit, signal } from "@angular/core";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag"
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { AssessoriaApiService } from "@core/services/assessoria-api.service";
import { AssessoriaResponseDto } from "@core/dtos/assessoria/assessoria-response.dto";
import { TemPermissaoDirective } from "@core/directives/tem-permissao.directive";

@Component({
    selector: 'app-assessoria-list',
    imports: [
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputMaskModule,
        InputTextModule,
        TagModule,
        PageHeaderComponent,
        TemPermissaoDirective
    ],
    templateUrl: './assessoria-list.component.html'
})

export class AssessoriaListComponent implements OnInit {
    private readonly assessoriaApi = inject(AssessoriaApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    assessorias: AssessoriaResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    assessoriaEditando: AssessoriaResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        {label: 'Dashboard', routerLink: '/dashboard'},
        {label: 'Assessorias'},
    ];

    form = this.fb.group({
        nome: ['', Validators.required],
        contato: ['', Validators.required],
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.assessoriaApi.getAll().subscribe({
            next: assessorias => this.assessorias = assessorias,
        });
    }

    abrirNovo(): void {
        this.assessoriaEditando = null;
        this.form.reset();
        this.dialogVisivel.set(true);
    }

    abrirEdicao(assessoria: AssessoriaResponseDto): void {
        this.assessoriaEditando = assessoria;
        this.form.patchValue({
            nome: assessoria.nome,
            contato: assessoria.contato,
        });
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
        const request$ = this.assessoriaEditando ? this.assessoriaApi.update(this.assessoriaEditando.id, dto) 
            : this.assessoriaApi.create(dto);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.assessoriaEditando ? 'Assessoria atualizada com sucesso!' 
                        : 'Assessoria criada com sucesso!',
                });
                this.fecharDialog();
                this.carregar();
                this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/assessorias', id]);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta assessoria?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.assessoriaApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Assessoria excluída com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}