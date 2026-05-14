import { ItemCondicionalResponseDto } from "../itemCondicional/item-condicional-response.dto";

export interface CondicionalUpdateDto {
    clienteId: number;
    dataInicio: string;
    periodo: number;
    dataFinal: string;
    itensCondicional: ItemCondicionalResponseDto[];
}