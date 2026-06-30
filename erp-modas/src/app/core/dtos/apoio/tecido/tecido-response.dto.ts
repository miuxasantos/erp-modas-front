import { Caimento } from "@core/enums/caimento.enum";
import { Elasticidade } from "@core/enums/elasticidade.enum";

export interface TecidoResponseDto {
    id: number;
    nome: string;
    gramatura: number;
    caimento: Caimento;
    elasticidade: Elasticidade;
}