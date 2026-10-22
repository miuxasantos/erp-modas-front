import { CategoriaResponseDto } from "../categoria/categoria-response.dto";
import { TecidoCatalogoDto } from "./tecido-catalogo.dto";
import { VariacaoPublicaResponseDto } from "./variacao-publica-response.dto";

export interface CatalogoResponseDto {
    id: number;
    nome: string;
    precoVenda: number;
    imagem: string | null;
    categoria: CategoriaResponseDto;
    tecido: TecidoCatalogoDto | null;
    variacoes: VariacaoPublicaResponseDto[];
}