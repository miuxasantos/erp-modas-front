import { ItemCompraResponseDto } from "../../dtos/dependentes/itemCompra/item-compra-response.dto";
import { VariacaoProduto } from "../apoio/variacao-produto.model";

export class ItemCompra {
    id: number;
    variacaoProduto: VariacaoProduto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;

    constructor(dto: ItemCompraResponseDto) {
        this.id = dto.id;
        this.variacaoProduto = new VariacaoProduto(dto.variacaoProduto);
        this.valorUnit = dto.valorUnit;
        this.quantidade = dto.quantidade;
        this.subTotal = dto.subTotal;
    }
}