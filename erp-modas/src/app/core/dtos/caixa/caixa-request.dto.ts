import { StatusCaixa } from "../../enums/status-caixa.enum";
import { MovimentacoesCaixaResponseDto } from "../movimentacoesCaixa/movimentacoes-caixa-response.dto";

export interface CaixaRequestDto {
    dataAbertura: string;
    dataFechamento: string;
    saldoAbertura: number;
    saldoFechamento: number;
    statusCaixa: StatusCaixa;
    movimentacoes: MovimentacoesCaixaResponseDto[];
    totalEntradas: number;
    totalSaidas: number;
    saldoTotal: number;
}