import { VendaPorDiaDto } from "./venda-por-dia.dto";
import { VendaRelatorioItemDto } from "./relatorio-venda-item.dto";

export interface RelatorioVendasResponseDto {
    inicio: string;
    fim: string;
    quantidadeVendas: number;
    faturamento: number;
    ticketMedio: number;
    vendasPorDia: VendaPorDiaDto[];
    vendas: VendaRelatorioItemDto[];
}