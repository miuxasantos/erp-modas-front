import { MovimentacoesCaixaResponseDto } from "../../dtos/movimentacoesCaixa/movimentacoes-caixa-response.dto";
import { OrigemMov } from "../../enums/origem-mov.enum";
import { TipoMovCaixa } from "../../enums/tipo-mov-caixa.enum";
import { Caixa } from "../caixa.model";

export class MovimentacoesCaixa {
    id: number;
    caixa: Caixa;
    data: Date;
    tipoMovCaixa: TipoMovCaixa;
    valor: number;
    descricao: string;
    origem: OrigemMov;
    origemId: number;

    constructor(dto: MovimentacoesCaixaResponseDto) {
        this.id = dto.id;
        this.caixa = new Caixa(dto.caixa);
        this.data = new Date(dto.data);
        this.tipoMovCaixa = dto.tipoMovCaixa;
        this.valor = dto.valor;
        this.descricao = dto.descricao;
        this.origem = dto.origemMov;
        this.origemId = dto.origemId;
    }
}
