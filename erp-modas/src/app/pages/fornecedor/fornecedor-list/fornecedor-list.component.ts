import { Component, inject, OnInit, signal } from "@angular/core";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag"
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { FornecedorApiService } from "@core/services/fornecedor-api.service";
import { FornecedorResponseDto } from "@core/dtos/fornecedor/fornecedor-response.dto";
import { TemPermissaoDirective } from "@core/directives/tem-permissao.directive";
import { AssessoriaApiService } from "@core/services/assessoria-api.service";
import { AssessoriaResponseDto } from "@core/dtos/assessoria/assessoria-response.dto";
import { MascaraPipe } from "@core/pipes/mascara.pipe";

@Component({
    selector: 'app-fornecedor-list',
    imports: [
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputMaskModule,
        InputTextModule,
        SelectModule,
        TagModule,
        MascaraPipe,
        PageHeaderComponent,
        TemPermissaoDirective
    ],
    templateUrl: './fornecedor-list.component.html'
})

export class FornecedorListComponent implements OnInit {
    private readonly fornecedorApi = inject(FornecedorApiService);
    private readonly assessoriaApi = inject(AssessoriaApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    fornecedores: FornecedorResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    fornecedorEditando: FornecedorResponseDto | null = null;
    assessorias: AssessoriaResponseDto[] = [];

    breadcrumbs: MenuItem[] = [
        {label: 'Home', routerLink: '/home'},
        {label: 'Fornecedores'},
    ];

    form = this.fb.group({
        nome: ['', Validators.required],
        contato: ['', Validators.required],
        assessoriaId: new FormControl<number | null>(null),
    });

    ngOnInit(): void {
        this.assessoriaApi.getAll().subscribe({
            next: assessorias => {
                this.assessorias = assessorias;
            },
        });
        this.carregar();
    }

    carregar(): void {
        this.fornecedorApi.getAll().subscribe({
            next: fornecedores => this.fornecedores = fornecedores,
        });
    }

    abrirNovo(): void {
        this.fornecedorEditando = null;
        this.form.reset();
        this.dialogVisivel.set(true);
    }

    abrirEdicao(fornecedor: FornecedorResponseDto): void {
        this.fornecedorEditando = fornecedor;
        this.form.patchValue({
            nome: fornecedor.nome,
            contato: fornecedor.contato,
            assessoriaId: fornecedor.assessoria?.id ?? null,
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
        const request$ = this.fornecedorEditando ? this.fornecedorApi.update(this.fornecedorEditando.id, dto) 
            : this.fornecedorApi.create(dto);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.fornecedorEditando ? 'Fornecedor atualizado com sucesso!' 
                        : 'Fornecedor criado com sucesso!',
                });
                this.fecharDialog();
                this.carregar();
                this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/fornecedores', id]);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este fornecedor?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.fornecedorApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Fornecedor excluído com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}