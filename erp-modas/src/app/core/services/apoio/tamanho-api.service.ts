import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { TamanhoResponseDto } from "@core/dtos/apoio/tamanho/tamanho-response.dto";
import { TamanhoRequestDto } from "@core/dtos/apoio/tamanho/tamanho-request.dto";
import { TamanhoUpdateDto } from "@core/dtos/apoio/tamanho/tamanho-update.dto";

@Injectable({ providedIn: 'root' })
export class TamanhoApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/tamanhos`;

    getAll(): Observable<TamanhoResponseDto[]> {
        return this.http.get<TamanhoResponseDto[]>(this.url);
    }

    getById(id: number): Observable<TamanhoResponseDto> {
        return this.http.get<TamanhoResponseDto>(`${this.url}/${id}`);
    }

    create(dto: TamanhoRequestDto): Observable<TamanhoResponseDto> {
        return this.http.post<TamanhoResponseDto>(this.url, dto);
    }

    update(id: number, dto: TamanhoUpdateDto): Observable<TamanhoResponseDto> {
        return this.http.put<TamanhoResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
