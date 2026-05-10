import { StatusConta } from "../../enums/status-conta.enum";

export interface ContasReceberResponseDto {
    id: number;
    dataLancamento: string;
    dataVencimento: string;
    dataPagamento: string;
    vendaId: number;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacao: string;
    statusConta: StatusConta;
}