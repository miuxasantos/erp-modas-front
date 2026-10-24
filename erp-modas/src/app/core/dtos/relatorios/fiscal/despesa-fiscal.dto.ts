import { FormaPagamento } from "@core/enums/forma-pagamento.enum";

export interface DespesaFiscalDto {
    data: string;
    descricao: string;
    formaPagamento: FormaPagamento | null;
    valor: number;
}