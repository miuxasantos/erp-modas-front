import { StatusConta } from "../../../enums/status-conta.enum";
import { CompraResponseDto } from "../../compra/compra-response.dto";

export interface ContasPagarResponseDto {
    id: number;
    fornecedorNome: string;
    dataLancamento: string;
    dataVencimento: string;
    dataPagamento: string;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
}