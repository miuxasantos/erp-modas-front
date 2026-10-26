import { Component, inject, OnInit, signal } from "@angular/core";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { SelectModule } from 'primeng/select';
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag"
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { TemPermissaoDirective } from "@core/directives/tem-permissao.directive";
import { TecidoApiService } from "@core/services/apoio/tecido-api.service";
import { TecidoResponseDto } from "@core/dtos/apoio/tecido/tecido-response.dto";
import { Caimento } from "@core/enums/caimento.enum";
import { Elasticidade } from "@core/enums/elasticidade.enum";
import { Tooltip } from "primeng/tooltip";

@Component({
    selector: 'app-tecido-list',
    imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    TagModule,
    PageHeaderComponent,
    TemPermissaoDirective,
    Tooltip
],
    templateUrl: './tecido-list.component.html'
})

export class TecidoListComponent implements OnInit {
    private readonly tecidoApi = inject(TecidoApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    tecidos: TecidoResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    tecidoEditando: TecidoResponseDto | null = null;
    caimentos = Object.values(Caimento);
    elasticidades = Object.values(Elasticidade);

    breadcrumbs: MenuItem[] = [
        {label: 'Home', routerLink: '/home'},
        {label: 'Tecidos'},
    ];

    form = this.fb.group({
        nome: ['', Validators.required],
        gramatura: [0],
        caimento: [null as Caimento | null],
        elasticidade: [null as Elasticidade | null],
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.tecidoApi.getAll().subscribe({
            next: tecidos => this.tecidos = tecidos,
        });
    }

    abrirNovo(): void {
        this.tecidoEditando = null;
        this.form.reset();
        this.dialogVisivel.set(true);
    }

    abrirEdicao(tecido: TecidoResponseDto): void {
        this.tecidoEditando = tecido;
        this.form.patchValue(tecido);
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
        const request$ = this.tecidoEditando ? this.tecidoApi.update(this.tecidoEditando.id, dto) 
            : this.tecidoApi.create(dto);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.tecidoEditando ? 'Tecido atualizado com sucesso!' 
                        : 'Tecido criado com sucesso!',
                });
                this.fecharDialog();
                this.carregar();
                this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/tecidos', id]);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta cor?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.tecidoApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Tecido excluído com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}