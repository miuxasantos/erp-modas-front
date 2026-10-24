import { FormaPagamento } from "@core/enums/forma-pagamento.enum";
import { OrigemMov } from "../../../enums/origem-mov.enum";
import { TipoMovCaixa } from "../../../enums/tipo-mov-caixa.enum";

export interface MovimentacoesCaixaResponseDto {
    id: number;
    data: string;
    tipoMovCaixa: TipoMovCaixa;
    valor: number;
    descricao: string;
    origemMov: OrigemMov;
    origemId: number;
    formaPagamento: FormaPagamento | null;
}