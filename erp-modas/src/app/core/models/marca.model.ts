import { MarcaResponseDto } from "@core/dtos/marca/marca-response.dto";

export class Marca {
    id: number;
    nome: string;
    observacoes: string;

    constructor(dto: MarcaResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.observacoes = dto.observacoes;
    }
}