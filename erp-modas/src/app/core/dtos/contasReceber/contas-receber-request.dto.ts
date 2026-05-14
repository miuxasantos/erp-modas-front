import { StatusConta } from "../../enums/status-conta.enum";

export interface ContasReceberRequestDto {
    dataLancamento: string;
    dataVencimento: string;
    dataRecebimento: string;
    vendaId: number;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
}