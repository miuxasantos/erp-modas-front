import { ItemCondicionalResponseDto } from "../itemCondicional/item-condicional-response.dto";

export interface CondicionalRequestDto {
    clienteId: number;
    dataInicio: string;
    periodo: number;
    dataFinal: string;
    itens: ItemCondicionalResponseDto[];
}