import { OrigemMov } from "../enums/origem-mov.enum";
import { TipoMovCaixa } from "../enums/tipo-mov-caixa.enum";

export interface MovimentacoesCaixa {
    id: number;
    caixa: Caixa;
    data: Date;
    tipoMovCaixa: TipoMovCaixa;
    valor: number;
    descricao: string;
    origem: OrigemMov;
    origemId: number;
}
