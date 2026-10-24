// shared/components/botao-exportar/botao-exportar.component.ts
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FormatoExportacao } from '@core/enums/formato-exportacao.enum';

/**
 * Botão "Exportar" com menu de formatos, igual em todas as páginas de relatório.
 * Só emite o formato escolhido: quem chama a API é a página, que sabe os filtros.
 */
@Component({
    selector: 'app-botao-exportar',
    imports: [ButtonModule, MenuModule],
    templateUrl: './botao-exportar.component.html',
})
export class BotaoExportarComponent {
    desabilitado = input<boolean>(false);
    carregando   = input<boolean>(false);

    exportar = output<FormatoExportacao>();

    readonly opcoes: MenuItem[] = [
        {
            label: 'PDF',
            icon: 'pi pi-file-pdf',
            command: () => this.exportar.emit(FormatoExportacao.PDF),
        },
        {
            label: 'CSV (Excel)',
            icon: 'pi pi-file-excel',
            command: () => this.exportar.emit(FormatoExportacao.CSV),
        },
    ];
}