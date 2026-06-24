import { StatusCaixa } from "../../enums/status-caixa.enum";

export interface CaixaUpdateDto {
    dataFechamento?: string;
    statusCaixa?: StatusCaixa;
}