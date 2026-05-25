import { CorResponseDto } from "../cor/cor-response.dto";
import { ProdutoResponseDto } from "../produto/produto-response.dto";
import { TamanhoResponseDto } from "../tamanho/tamanho-response.dto";

export interface VariacaoProdutoResponseDto {
    id: number;
    sku: string;
    estoque: number;
    produtoId: number;
    produto: ProdutoResponseDto;
    precoCusto: number;
    precoVenda: number;
    imagemEsp: string;
    corId: number;
    cor: CorResponseDto;
    tamanhoId: number;
    tamanho: TamanhoResponseDto;
}