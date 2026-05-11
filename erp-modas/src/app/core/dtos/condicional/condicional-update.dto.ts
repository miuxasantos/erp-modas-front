import { ClienteResponseDto } from "../cliente/cliente-response.dto";
import { ItemCondicionalResponseDto } from "../itemCondicional/item-condicional-response.dto";

export interface CondicionalUpdateDto {
    cliente: ClienteResponseDto;
    dataInicio: string;
    periodo: number;
    dataFinal: string;
    itensCondicional: ItemCondicionalResponseDto[];
}