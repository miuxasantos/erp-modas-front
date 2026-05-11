import { ItemVendaResponseDto } from "../../dtos/itemVenda/item-venda-response.dto";
import { VariacaoProduto } from "../apoio/variacao-produto.model";
import { Venda } from "../venda.models";

export class ItemVenda {
    id: number;
    venda: Venda;
    variacaoProduto: VariacaoProduto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;

    constructor(dto: ItemVendaResponseDto) {
        this.id = dto.id;
        this.venda = new Venda(dto.vendaId);
        this.variacaoProduto = new VariacaoProduto(dto.variacaoProdutoId);
        this.valorUnit = dto.valorUnit;
        this.quantidade = dto.quantidade;
        this.subTotal = dto.subTotal;
    }
}