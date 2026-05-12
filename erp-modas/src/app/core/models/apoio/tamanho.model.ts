import { TamanhoResponseDto } from "../../dtos/tamanho/tamanho-response.dto";
import { TamanhoEnum } from "../../enums/tamanho.enum";

export class Tamanho {
    id: number;
    tamanho: TamanhoEnum;

    constructor(dto: TamanhoResponseDto) {
        this.id = dto.id;
        this.tamanho = dto.tamanho;
    }
}