import { CorResponseDto } from "../cor/cor-response.dto";
import { ProdutoResponseDto } from "../produto/produto-response.dto";
import { TamanhoResponseDto } from "../tamanho/tamanho-response.dto";

export interface VariacaoProdutoRequestDto {
    sku: string;
    estoque: number;
    produto: ProdutoResponseDto;
    precoCusto: number;
    precoVenda: number;
    imagemEsp: string;
    cor: CorResponseDto;
    tamanho: TamanhoResponseDto;
}