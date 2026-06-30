import { StatusConta } from "../../../enums/status-conta.enum";

export interface ContasReceberResponseDto {
    id: number;
    clienteNome: string;
    dataLancamento: string;
    dataVencimento: string;
    dataRecebimento: string;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
}