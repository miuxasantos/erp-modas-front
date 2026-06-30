import { StatusCaixa } from "../../enums/status-caixa.enum";
import { MovimentacoesCaixaResponseDto } from "../dependentes/movimentacoesCaixa/movimentacoes-caixa-response.dto";

export interface CaixaResponseDto {
    id: number;
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