import { Component, inject, OnInit, signal } from "@angular/core";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag"
import { ClienteApiService } from "@core/services/cliente-api.service";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { ClienteResponseDto } from "@core/dtos/cliente/cliente-response.dto";
import { TemPermissaoDirective } from "@core/directives/tem-permissao.directive";

@Component({
    selector: 'app-cliente-list',
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
    templateUrl: './cliente-list.component.html'
})

export class ClienteListComponent implements OnInit {
    private readonly clienteApi = inject(ClienteApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    clientes: ClienteResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    clienteEditando: ClienteResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        {label: 'Dashboard', routerLink: '/dashboard'},
        {label: 'Clientes'},
    ];

    form = this.fb.group({
        nome: ['', Validators.required],
        contato: ['', Validators.required],
        documento: [''],
        rua: [''],
        numero: [''],
        bairro: [''],
        cidade: [''],
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.clienteApi.getAll().subscribe({
            next: clientes => this.clientes = clientes,
        });
    }

    abrirNovo(): void {
        this.clienteEditando = null;
        this.form.reset();
        this.dialogVisivel.set(true);
    }

    abrirEdicao(cliente: ClienteResponseDto): void {
        this.clienteEditando = cliente;
        this.form.patchValue(cliente);
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
        const request$ = this.clienteEditando ? this.clienteApi.update(this.clienteEditando.id, dto) 
            : this.clienteApi.create(dto);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.clienteEditando ? 'Cliente atualizado com sucesso!' 
                        : 'Cliente criado com sucesso!',
                });
                this.fecharDialog();
                this.carregar();
                this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/clientes', id]);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este cliente?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.clienteApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Cliente excluído com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }
}