import { CaixaResponseDto } from "../dtos/caixa/caixa-response.dto";
import { StatusCaixa } from "../enums/status-caixa.enum";
import { MovimentacoesCaixa } from "./dependentes/movimentacoes-caixa.model";

export class Caixa {
    id: number;
    dataAbertura: Date;
    dataFechamento: Date;
    saldoAbertura: number;
    saldoFechamento: number;
    statusCaixa: StatusCaixa;
    totalEntradas: number;
    totalSaidas: number;
    saldoTotal: number;
    movimentacoes: MovimentacoesCaixa[];

    constructor(dto: CaixaResponseDto) {
        this.id = dto.id;
        this.dataAbertura = new Date(dto.dataAbertura);
        this.dataFechamento = new Date(dto.dataFechamento);
        this.saldoAbertura = dto.saldoAbertura;
        this.saldoFechamento = dto.saldoFechamento;
        this.statusCaixa = dto.statusCaixa;
        this.totalEntradas = dto.totalEntradas;
        this.totalSaidas = dto.totalSaidas;
        this.saldoTotal = dto.saldoTotal;
        this.movimentacoes = dto.movimentacoes?.map(m => new MovimentacoesCaixa(m)) || [];
    }
}