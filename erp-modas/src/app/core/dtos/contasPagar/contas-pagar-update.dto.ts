import { StatusConta } from "../../enums/status-conta.enum";

export interface ContasPagarUpdateDto {
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