import { AssessoriaResponseDto } from '@core/dtos/assessoria/assessoria-response.dto';

export class Assessoria {
    id: number;
    nome: string;
    contato: string;

    constructor(dto: AssessoriaResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.contato = dto.contato;
    }
}