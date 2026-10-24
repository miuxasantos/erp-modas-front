import { FormaPagamento } from "@core/enums/forma-pagamento.enum";

export interface VendaRelatorioItemDto {
    id: number;
    data: string;
    cliente: string;
    formaPagamento: FormaPagamento;
    valorTotal: number;
}