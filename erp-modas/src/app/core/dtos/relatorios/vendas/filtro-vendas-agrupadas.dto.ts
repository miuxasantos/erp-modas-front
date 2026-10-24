import { AgrupamentoVenda } from "@core/enums/agrupamento-venda.enum";

export interface FiltroVendasAgrupadasDto {
    agrupamento: AgrupamentoVenda;
    inicio: string;
    fim: string;
}