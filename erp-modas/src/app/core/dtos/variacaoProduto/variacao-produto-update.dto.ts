import { CorResponseDto } from "../cor/cor-response.dto";
import { ProdutoResponseDto } from "../produto/produto-response.dto";
import { TamanhoResponseDto } from "../tamanho/tamanho-response.dto";

export interface VariacaoProdutoUpdateDto {
    sku?: string;
    estoque?: number;
    produtoId?: number;
    precoCusto?: number;
    precoVenda?: number;
    imagemEsp?: string;
    corId?: number;
    tamanhoId?: number;
}