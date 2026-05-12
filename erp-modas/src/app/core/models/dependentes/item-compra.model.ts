import { ItemCompraResponseDto } from "../../dtos/itemCompra/item-compra-response.dto";
import { VariacaoProduto } from "../apoio/variacao-produto.model";
import { Compra } from "../compra.model";

export class ItemCompra {
    id: number;
    compra: Compra;
    variacaoProduto: VariacaoProduto;
    valorUnit: number;
    quantidade: number;
    subTotal: number;

    constructor(dto: ItemCompraResponseDto) {
        this.id = dto.id;
        this.compra = new Compra(dto.compra);
        this.variacaoProduto = new VariacaoProduto(dto.variacaoProduto);
        this.valorUnit = dto.valorUnit;
        this.quantidade = dto.quantidade;
        this.subTotal = dto.subTotal;
    }
}