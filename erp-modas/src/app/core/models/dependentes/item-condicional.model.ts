import { ItemCondicionalResponseDto } from "../dtos/itemCondicional/item-condicional-response.dto";
import { VariacaoProduto } from "./variacao-produto.model";

export class ItemCondicional {
    id: number;
    variacaoProduto: VariacaoProduto;
    quantidade: number;
    condicional: Condicional;

    constructor(dto: ItemCondicionalResponseDto) {
        this.id = dto.id;
        this.variacaoProduto = new VariacaoProduto(dto.variacaoProduto);
        this.quantidade = dto.quantidade;
        this.condicional = new Condicional(dto.condicional);
    }
}