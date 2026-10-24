import { DiaFiscalDto } from "./dia-fiscal.dto";
import { DespesaFiscalDto } from "./despesa-fiscal.dto";

export interface RelatorioFiscalResponseDto {
    ano: number;
    mes: number;
    dias: DiaFiscalDto[];
    despesas: DespesaFiscalDto[];
    totaisMes: DiaFiscalDto;
}