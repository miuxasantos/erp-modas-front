import { Directive, effect, inject, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from "@core/services/auth/auth.service";

type Permissao = 'isProprietario' | 'isVendedor' | 'gerenciarUsuarios' | 'gerenciarFinanceiro' | 
    'gerenciarProdutos' | 'abrirCaixa' | 'fecharCaixa';

@Directive({ selector: '[temPermissao]', standalone: true})
export class TemPermissaoDirective {
    private readonly auth = inject(AuthService);
    private readonly templateRef = inject(TemplateRef<any>);
    private readonly viewContainer = inject(ViewContainerRef);
    private renderizado = false;

    @Input() set temPermissao(permissao: Permissao) {

        effect(() => {
            const permitido = this.auth[permissao]();

            if(permitido && !this.renderizado) {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.renderizado = true;
            } else if(!permitido && this.renderizado) {
                this.viewContainer.clear();
                this.renderizado = false;
            }
        });
    }

}