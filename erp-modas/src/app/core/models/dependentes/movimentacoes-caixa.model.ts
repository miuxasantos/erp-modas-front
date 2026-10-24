import { MovimentacoesCaixaResponseDto } from "../../dtos/dependentes/movimentacoesCaixa/movimentacoes-caixa-response.dto";
import { OrigemMov } from "../../enums/origem-mov.enum";
import { TipoMovCaixa } from "../../enums/tipo-mov-caixa.enum";
import { FormaPagamento } from "@core/enums/forma-pagamento.enum";

export class MovimentacoesCaixa {
    id: number;
    data: Date;
    tipoMovCaixa: TipoMovCaixa;
    valor: number;
    descricao: string;
    origem: OrigemMov;
    origemId: number;
    formaPagamento: FormaPagamento;

    constructor(dto: MovimentacoesCaixaResponseDto) {
        this.id = dto.id;
        this.data = new Date(dto.data);
        this.tipoMovCaixa = dto.tipoMovCaixa;
        this.valor = dto.valor;
        this.descricao = dto.descricao;
        this.origem = dto.origemMov;
        this.origemId = dto.origemId;
        this.formaPagamento = dto.formaPagamento;
    }
}
