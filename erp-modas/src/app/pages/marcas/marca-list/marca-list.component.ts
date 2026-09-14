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
import { TemPermissaoDirective } from "@core/directives/tem-permissao.directive";
import { MarcaApiService } from "@core/services/marca-api.service";
import { MarcaResponseDto } from "@core/dtos/marca/marca-response.dto";

@Component({
    selector: 'app-marca-list',
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
    templateUrl: './marca-list.component.html'
})

export class MarcaListComponent implements OnInit {
    private readonly marcaApi = inject(MarcaApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    marcas: MarcaResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    marcaEditando: MarcaResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        {label: 'Dashboard', routerLink: '/dashboard'},
        {label: 'Marcas'},
    ];

    form = this.fb.group({
        nome: ['', Validators.required],
        observacoes: [''],
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.marcaApi.getAll().subscribe({
            next: marcas => this.marcas = marcas,
        });
    }

    abrirNovo(): void {
        this.marcaEditando = null;
        this.form.reset();
        this.dialogVisivel.set(true);
    }

    abrirEdicao(marca: MarcaResponseDto): void {
        this.marcaEditando = marca;
        this.form.patchValue(marca);
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
        const request$ = this.marcaEditando ? this.marcaApi.update(this.marcaEditando.id, dto) 
            : this.marcaApi.create(dto);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.marcaEditando ? 'Marca atualizada com sucesso!' 
                        : 'Marca criada com sucesso!',
                });
                this.fecharDialog();
                this.carregar();
                this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/marcas', id]);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta marca?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.marcaApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Marca excluída com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}