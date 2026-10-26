import { Component, input, output, inject, computed } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { NgClass } from "@angular/common";
import { AuthService } from "../../core/services/auth/auth.service";

interface NavItem {
    label: string;
    icon: string;
    route: string;
    visivel?: () => boolean;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

@Component({
    selector: 'app-sidebar',
    imports: [ButtonModule, NgClass, DividerModule, RouterLink, RouterLinkActive],
    templateUrl: "./sidebar-layout.component.html",
})

export class SidebarComponent {
    private readonly auth = inject(AuthService);
    visivel = input<boolean>(false);
    fechar = output<void>();

    navGroups: NavGroup[] = [
        {
            label: 'Principais',
            items: [
                { label: 'Home', icon: 'pi pi-home', route: '/home'},
                { label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/dashboard'},
                { label: 'Vendas', icon: 'pi pi-shopping-cart', route: '/vendas'},
                { label: 'Condicionais', icon: 'pi pi-box', route: '/condicionais'},
                { label: 'Compras', icon: 'pi pi-truck', route: '/compras'},
            ]
        },
        {
            label: 'Cadastros',
            items: [
                { label: 'Produtos', icon: 'pi pi-tag', route: '/produtos'},
                { label: 'Clientes', icon: 'pi pi-users', route: '/clientes'},
                { label: 'Fornecedores', icon: 'pi pi-home', route: '/fornecedores'},
                { label: 'Categorias', icon: 'pi pi-list', route: '/categorias'},
                { label: 'Cores', icon: 'pi pi-palette', route: '/cores'},
                { label: 'Marcas', icon: 'pi pi-star', route: '/marcas'},
                { label: 'Tecidos', icon: 'pi pi-th-large', route: '/tecidos'},
                { label: 'Assessoria', icon: 'pi pi-briefcase', route: '/assessorias'},
                { label: 'Tamanhos', icon: 'pi pi-sort-alt', route: '/tamanhos'},
            ]
        },
        {
            label: 'Financeiro',
            items: [
                { label: 'Caixa', icon: 'pi pi-wallet', route: '/financeiro/caixa'},
                { label: 'Contas a Pagar', icon: 'pi pi-arrow-down-left', route: '/financeiro/contas-pagar', visivel: () => this.auth.isProprietario()},
                { label: 'Contas a Receber', icon: 'pi pi-arrow-up-right', route: '/financeiro/contas-receber', visivel: () => this.auth.isProprietario()},
            ]
        },
        {
            label: 'Relatórios',
            items: [
                { label: 'Vendas', icon: 'pi pi-chart-line', route: '/relatorios/vendas', visivel: () => this.auth.isProprietario() },
                { label: 'Vendas agrupadas', icon: 'pi pi-chart-bar', route: '/relatorios/vendas-agrupadas', visivel: () => this.auth.isProprietario() },
                { label: 'Compras', icon: 'pi pi-truck', route: '/relatorios/compras', visivel: () => this.auth.isProprietario() },
                { label: 'Compras c/ mais produtos', icon: 'pi pi-box', route: '/relatorios/compras-mais-produtos', visivel: () => this.auth.isProprietario() },
                { label: 'Fornecedores', icon: 'pi pi-building', route: '/relatorios/fornecedores', visivel: () => this.auth.isProprietario() },
                { label: 'Estoque', icon: 'pi pi-warehouse', route: '/relatorios/estoque', visivel: () => this.auth.isProprietario() },
                { label: 'Financeiro', icon: 'pi pi-wallet', route: '/relatorios/financeiro', visivel: () => this.auth.isProprietario() },
                { label: 'Fiscal mensal', icon: 'pi pi-calculator', route: '/relatorios/fiscal', visivel: () => this.auth.isProprietario() },
            ]
        },
        {
            label: 'Configurações',
            items: [
                { label: 'Usuários', icon: 'pi pi-user', route: '/usuarios', visivel: () => this.auth.isProprietario()},
                { label: 'Auditoria', icon: 'pi pi-history', route: '/auditoria', visivel: () => this.auth.isProprietario() },
            ]
        }
    ];

    gruposVisiveis = computed(() =>
        this.navGroups
        .map(group => ({
            ...group,
            items: group.items.filter(item => !item.visivel || item.visivel()),
        }))
        .filter(group => group.items.length > 0)
    );
}