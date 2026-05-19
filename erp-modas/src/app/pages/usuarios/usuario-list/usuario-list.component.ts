import { Component, inject, OnInit, signal } from "@angular/core";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag"
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { UsuarioApiService } from "@core/services/usuario-api.service";
import { UsuarioResponseDto } from "@core/dtos/usuario/usuario-response.dto";
import { Cargo } from "@core/enums/cargo.enum";
import { enumToOptions } from "@core/utils/enum-options.utils";
import { SelectModule } from "primeng/select";

@Component({
    selector: 'app-usuario-list',
    imports: [
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TagModule,
        SelectModule,
        PageHeaderComponent,
    ],
    templateUrl: './usuario-list.component.html'
})

export class UsuarioListComponent implements OnInit {
    private readonly usuarioApi = inject(UsuarioApiService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    usuarios: UsuarioResponseDto[] = [];
    dialogVisivel = signal(false);
    salvando = signal(false);
    usuarioEditando: UsuarioResponseDto | null = null;

    breadcrumbs: MenuItem[] = [
        {label: 'Dashboard', routerLink: '/dashboard'},
        {label: 'Usuarios'},
    ];

    form = this.fb.group({

        nome: new FormControl<string | null>(
            null,
            Validators.required
        ),

        email: new FormControl<string | null>(
            null,
            Validators.required
        ),

        cargo: new FormControl<Cargo | null>(
            null,
            Validators.required
        ),

        status: new FormControl<boolean | null>(
            true
        ),

        senha: new FormControl<string | null>(
            null
        )
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.usuarioApi.getAll().subscribe({
            next: usuarios => this.usuarios = usuarios,
        });
    }

    abrirNovo(): void {
        this.usuarioEditando = null;
        this.form.reset();
        this.dialogVisivel.set(true);
    }

    abrirEdicao(usuario: UsuarioResponseDto): void {
        this.usuarioEditando = usuario;
        this.form.patchValue(usuario);
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
        const request$ = this.usuarioEditando ? this.usuarioApi.update(this.usuarioEditando.id, dto) 
            : this.usuarioApi.create(dto);

        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.usuarioEditando ? 'Usuario atualizado com sucesso!' 
                        : 'Usuario criado com sucesso!',
                });
                this.fecharDialog();
                this.carregar();
                this.salvando.set(false);
            },
            error: () => this.salvando.set(false),
        });
    }

    verDetalhe(id: number): void {
        this.router.navigate(['/usuarios', id]);
    }

    confirmarExclusao(id: number): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este usuario?',
            header: 'Confirmar exclusão',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.usuarioApi.delete(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Usuario excluído com sucesso',
                        });
                        this.carregar();
                    },
                });
            },
        });
    }

    cargoOptions = enumToOptions(Cargo);
}