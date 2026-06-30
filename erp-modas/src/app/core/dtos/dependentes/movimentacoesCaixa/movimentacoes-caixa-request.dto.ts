import { OrigemMov } from "../../../enums/origem-mov.enum";
import { TipoMovCaixa } from "../../../enums/tipo-mov-caixa.enum";

export interface MovimentacoesCaixaRequestDto {
    data: string;
    tipoMovCaixa: TipoMovCaixa;
    valor: number;
    descricao: string;
    origemMov: OrigemMov;
    origemId: number;
}