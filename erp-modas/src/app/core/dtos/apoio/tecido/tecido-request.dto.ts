import { Caimento } from "@core/enums/caimento.enum";
import { Elasticidade } from "@core/enums/elasticidade.enum";

export interface TecidoRequestDto {
    nome: string;
    gramatura: number;
    caimento: Caimento;
    elasticidade: Elasticidade;
}