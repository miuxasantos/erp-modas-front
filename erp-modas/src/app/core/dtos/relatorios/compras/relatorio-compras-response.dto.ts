import { CompraResumoResponseDto } from "./compra-resumo-response.dto";

export interface RelatorioComprasResponseDto {
    inicio: string;
    fim: string;
    quantidadeCompras: number;
    valorTotal: number;
    ticketMedio: number;
    compras: CompraResumoResponseDto[];
}