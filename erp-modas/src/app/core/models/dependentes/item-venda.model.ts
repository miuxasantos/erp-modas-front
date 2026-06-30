import { ItemVendaResponseDto } from "../../dtos/dependentes/itemVenda/item-venda-response.dto";
import { VariacaoProduto } from "../apoio/variacao-produto.model";

export class ItemVenda {
    id: number;
    variacaoProduto: VariacaoProduto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;

    constructor(dto: ItemVendaResponseDto) {
        this.id = dto.id;
        this.variacaoProduto = new VariacaoProduto(dto.variacaoProduto);
        this.valorUnit = dto.valorUnit;
        this.quantidade = dto.quantidade;
        this.subTotal = dto.subTotal;
    }
}