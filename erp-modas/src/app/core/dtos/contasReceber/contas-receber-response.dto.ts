import { StatusConta } from "../../enums/status-conta.enum";
import { VendaResponseDto } from "../venda/venda-response.dto";

export interface ContasReceberResponseDto {
    id: number;
    dataLancamento: string;
    dataVencimento: string;
    dataRecebimento: string;
    venda: VendaResponseDto;
    valor: number;
    numeroParcela: number;
    totalParcelas: number;
    observacoes: string;
    statusConta: StatusConta;
}