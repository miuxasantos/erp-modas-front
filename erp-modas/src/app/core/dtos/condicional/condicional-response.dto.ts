import { ItemCondicionalResponseDto } from "../itemCondicional/item-condicional-response.dto";

export interface CondicionalResponseDto {
    id: number;
    clienteId: number;
    dataInicio: string;
    periodo: number;
    dataFinal: string;
    itens: ItemCondicionalResponseDto[];
}