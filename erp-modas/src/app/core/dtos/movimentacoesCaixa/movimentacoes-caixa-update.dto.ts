import { OrigemMov } from "../../enums/origem-mov.enum";
import { TipoMovCaixa } from "../../enums/tipo-mov-caixa.enum";
import { CaixaResponseDto } from "../caixa/caixa-response.dto";

export interface MovimentacoesCaixaUpdateDto {
    caixa?: CaixaResponseDto;
    data?: string;
    tipoMovCaixa?: TipoMovCaixa;
    valor?: number;
    descricao?: string;
    origemMov?: OrigemMov;
    origemId?: number;
}