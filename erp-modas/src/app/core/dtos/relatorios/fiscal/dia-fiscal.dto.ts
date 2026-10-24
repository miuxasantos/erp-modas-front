export interface DiaFiscalDto {
    data: string;

    entradaDinheiro: number;
    entradaPix: number;
    entradaCartao: number;
    entradaOutros: number;
    totalEntradas: number;

    saidaDinheiro: number;
    saidaPix: number;
    saidaCartao: number;
    saidaOutros: number;
    totalSaidas: number;

    saldo: number;
}
