import { CorResponseDto } from "../apoio/cor/cor-response.dto";
import { TamanhoResponseDto } from "../apoio/tamanho/tamanho-response.dto";
import { CategoriaResponseDto } from "../categoria/categoria-response.dto";

export interface CatalogoFiltrosDto {
    categorias: CategoriaResponseDto[];
    cores: CorResponseDto[];
    tamanhos: TamanhoResponseDto[];
}