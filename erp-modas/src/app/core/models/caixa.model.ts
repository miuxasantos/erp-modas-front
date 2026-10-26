import { parseDataLocal } from "@core/utils/data.utils";
import { CaixaResponseDto } from "../dtos/caixa/caixa-response.dto";
import { StatusCaixa } from "../enums/status-caixa.enum";
import { MovimentacoesCaixa } from "./dependentes/movimentacoes-caixa.model";
import { parse } from "path";

export class Caixa {
    id: number;
    dataAbertura: Date;
    dataFechamento: Date | null;
    saldoAbertura: number;
    saldoFechamento: number;
    statusCaixa: StatusCaixa;
    totalEntradas: number;
    totalSaidas: number;
    saldoTotal: number;
    movimentacoes: MovimentacoesCaixa[];

    constructor(dto: CaixaResponseDto) {
        this.id = dto.id;
        this.dataAbertura = parseDataLocal(dto.dataAbertura)!;
        this.dataFechamento = parseDataLocal(dto.dataFechamento);
        this.saldoAbertura = dto.saldoAbertura;
        this.saldoFechamento = dto.saldoFechamento;
        this.statusCaixa = dto.statusCaixa;
        this.totalEntradas = dto.totalEntradas;
        this.totalSaidas = dto.totalSaidas;
        this.saldoTotal = dto.saldoTotal;
        this.movimentacoes = dto.movimentacoes?.map(m => new MovimentacoesCaixa(m)) || [];
    }
}