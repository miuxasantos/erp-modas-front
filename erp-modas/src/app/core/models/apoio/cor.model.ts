import { CorResponseDto } from "../../dtos/apoio/cor/cor-response.dto";

export class Cor {
    id: number;
    nome: string;
    codigoHex: string;

    constructor(dto: CorResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.codigoHex = dto.codigoHex;
    }
}