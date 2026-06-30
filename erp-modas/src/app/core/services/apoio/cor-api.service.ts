import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { CorRequestDto } from "@core/dtos/apoio/cor/cor-request.dto";
import { CorUpdateDto } from "@core/dtos/apoio/cor/cor-update.dto";
import { CorResponseDto } from "@core/dtos/apoio/cor/cor-response.dto";

@Injectable({ providedIn: 'root' })
export class CorApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/cores`;

    getAll(): Observable<CorResponseDto[]> {
        return this.http.get<CorResponseDto[]>(this.url);
    }

    getById(id: number): Observable<CorResponseDto> {
        return this.http.get<CorResponseDto>(`${this.url}/${id}`);
    }

    create(dto: CorRequestDto): Observable<CorResponseDto> {
        return this.http.post<CorResponseDto>(this.url, dto);
    }

    update(id: number, dto: CorUpdateDto): Observable<CorResponseDto> {
        return this.http.put<CorResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
