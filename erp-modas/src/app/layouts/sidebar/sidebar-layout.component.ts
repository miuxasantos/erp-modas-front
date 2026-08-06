import { Component, input, output } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { NgClass } from "@angular/common";

interface NavItem {
    label: string;
    icon: string;
    route: string;
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
    visivel = input<boolean>(false);
    fechar = output<void>();

    navGroups: NavGroup[] = [
        {
            label: 'Principais',
            items: [
                { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard'},
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
            ]
        },
        {
            label: 'Financeiro',
            items: [
                { label: 'Caixa', icon: 'pi pi-wallet', route: '/financeiro/caixa'},
                { label: 'Contas a Pagar', icon: 'pi pi-arrow-down-left', route: '/financeiro/contas-pagar'},
                { label: 'Contas a Receber', icon: 'pi pi-arrow-up-right', route: '/financeiro/contas-receber'},
            ]
        },
        {
            label: 'Configurações',
            items: [
                { label: 'Usuários', icon: 'pi pi-user', route: '/usuarios'},
                //{ label: 'Auditoria', icon: 'pi pi-history', route: '/auditoria'},
                { label: 'Tamanhos', icon: 'pi pi-sort-alt', route: '/tamanhos'},
                { label: 'Administrador', icon: 'pi pi-home', route: '/dashboard'},
            ]
        },
        {
            label: 'Acesso',
            items: [
                { label: 'Login', icon: 'pi pi-sign-in', route: '/login'},
            ]
        },
        {
            label: 'Relatórios',
            items: [
                { label: 'Vendas', icon: 'pi pi-chart-line', route: '/relatorios/vendas'},
            ]
        }
    ]
}