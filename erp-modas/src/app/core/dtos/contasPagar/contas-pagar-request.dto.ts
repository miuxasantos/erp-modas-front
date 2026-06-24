import { StatusConta } from "../../enums/status-conta.enum";

export interface ContasPagarRequestDto {
    fornecedorNome: string;
    dataVencimento: string;
    dataPagamento: string;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
}