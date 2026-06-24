import { StatusCaixa } from "../../enums/status-caixa.enum";

export interface CaixaRequestDto {
    dataAbertura: string;
    saldoAbertura: number;
    statusCaixa: StatusCaixa;
}