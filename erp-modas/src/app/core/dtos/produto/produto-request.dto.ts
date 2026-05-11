import { CategoriaResponseDto } from "../categoria/categoria-response.dto";
import { CompraResponseDto } from "../compra/compra-response.dto";

export interface ProdutoRequestDto {
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    dataInclusao: string;
    dataDesativacao: string;
    compra: CompraResponseDto;
    tecido: string;
    marca: string;
    categoria: CategoriaResponseDto;
    imagem: string;
}