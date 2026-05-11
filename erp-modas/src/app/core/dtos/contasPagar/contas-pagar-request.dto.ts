import { StatusConta } from "../../enums/status-conta.enum";
import { CompraResponseDto } from "../compra/compra-response.dto";

export interface ContasPagarRequestDto {
    dataLancamento: string;
    dataVencimento: string;
    dataPagamento: string;
    compra: CompraResponseDto;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
}