import { VariacaoProdutoResponseDto } from "../../dtos/variacaoProduto/variacao-produto-response.dto";
import { Cor } from "./cor.model";
import { Produto } from "../produto.model";
import { Tamanho } from "./tamanho.model";

export class VariacaoProduto {
    id: number;
    sku: string;
    estoque: number;
    produto: Produto;
    produtoId: number;
    precoCusto: number;
    precoVenda: number;
    imagemEsp: string;
    cor: Cor;
    corId: number;
    tamanho: Tamanho;
    tamanhoId: number;

    constructor(dto: VariacaoProdutoResponseDto) {
        this.id = dto.id;
        this.sku = dto.sku;
        this.estoque = dto.estoque;
        this.produto = new Produto(dto.produto);
        this.produtoId = dto.produtoId
        this.precoCusto = dto.precoCusto;
        this.precoVenda = dto.precoVenda;
        this.imagemEsp = dto.imagemEsp;
        this.cor = new Cor(dto.cor);
        this.corId = dto.corId;
        this.tamanho = new Tamanho(dto.tamanho);
        this.tamanhoId = dto.tamanhoId;
    }

}