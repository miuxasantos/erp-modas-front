import { TecidoResponseDto } from "@core/dtos/apoio/tecido/tecido-response.dto";
import { Caimento } from "@core/enums/caimento.enum";
import { Elasticidade } from "@core/enums/elasticidade.enum";

export class Tecido {
    id: number;
    nome: string;
    gramatura: number;
    caimento: Caimento;
    elasticidade: Elasticidade;

    constructor(dto: TecidoResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.gramatura = dto.gramatura;
        this.caimento = dto.caimento;
        this.elasticidade = dto.elasticidade;
    }
}