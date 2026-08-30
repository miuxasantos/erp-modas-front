import { CategoriaResponseDto } from "../categoria/categoria-response.dto";
import { VariacaoPublicaResponseDto } from "./variacao-publica-response.dto";

export interface CatalogoResponseDto {
    id: number;
    nome: string;
    precoVenda: number;
    imagem: string;
    categoria: CategoriaResponseDto;
    tecido: string;
    variacoes: VariacaoPublicaResponseDto[];
}