import { CategoriaResponseDto } from "../dtos/categoria/categoria-response.dto";

export class Categoria {
    id: number;
    nome: string;

    constructor(dto: CategoriaResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
    }
}