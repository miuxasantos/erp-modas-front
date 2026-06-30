import { AssessoriaResponseDto } from "../assessoria/assessoria-response.dto";

export interface FornecedorResponseDto {
    id: number;
    nome: string;
    contato: string;
    assessoria: AssessoriaResponseDto;
}