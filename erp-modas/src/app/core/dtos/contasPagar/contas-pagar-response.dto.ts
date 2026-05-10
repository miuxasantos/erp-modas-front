import { StatusConta } from "../../enums/status-conta.enum";

export interface ContasPagarResponseDto {
    id: number;
    dataLancamento: string;
    dataVencimento: string;
    dataPagamento: string;
    compraId: number;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacao: string;
    statusConta: StatusConta;
}