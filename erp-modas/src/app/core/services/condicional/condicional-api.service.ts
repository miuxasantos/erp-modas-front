import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { CondicionalResponseDto } from "@core/dtos/condicional/condicional-response.dto";
import { ItemCondicionalResponseDto } from "@core/dtos/dependentes/itemCondicional/item-condicional-response.dto";
import { CondicionalRequestDto } from "@core/dtos/condicional/condicional-request.dto";
import { CondicionalUpdateDto } from "@core/dtos/condicional/condicional-update.dto";


@Injectable({ providedIn: 'root' })
export class CondicionalApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/condicionais`;

    getAll(): Observable<CondicionalResponseDto[]> {
        return this.http.get<CondicionalResponseDto[]>(this.url);
    }

    getById(id: number): Observable<CondicionalResponseDto> {
        return this.http.get<CondicionalResponseDto>(`${this.url}/${id}`);
    }

    getItens(condicionalId: number): Observable<ItemCondicionalResponseDto[]> {
        return this.http.get<ItemCondicionalResponseDto[]>(`${this.url}/${condicionalId}/itens`);
    }

    create(dto: CondicionalRequestDto): Observable<CondicionalResponseDto> {
        return this.http.post<CondicionalResponseDto>(this.url, dto);
    }

    update(id: number, dto: CondicionalUpdateDto): Observable<CondicionalResponseDto> {
        return this.http.put<CondicionalResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
