import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { TecidoResponseDto } from "@core/dtos/apoio/tecido/tecido-response.dto";
import { TecidoUpdateDto } from "@core/dtos/apoio/tecido/tecido-update.dto";
import { TecidoRequestDto } from "@core/dtos/apoio/tecido/tecido-request.dto";

@Injectable({ providedIn: 'root' })
export class TecidoApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/tecidos`;

    getAll(): Observable<TecidoResponseDto[]> {
        return this.http.get<TecidoResponseDto[]>(this.url);
    }

    getById(id: number): Observable<TecidoResponseDto> {
        return this.http.get<TecidoResponseDto>(`${this.url}/${id}`);
    }

    create(dto: TecidoRequestDto): Observable<TecidoResponseDto> {
        return this.http.post<TecidoResponseDto>(this.url, dto);
    }

    update(id: number, dto: TecidoUpdateDto): Observable<TecidoResponseDto> {
        return this.http.put<TecidoResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}