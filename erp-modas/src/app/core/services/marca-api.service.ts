import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { MarcaResponseDto } from "@core/dtos/marca/marca-response.dto";
import { MarcaUpdateDto } from "@core/dtos/marca/marca-update.dto";
import { MarcaRequestDto } from "@core/dtos/marca/marca-request.dto";

@Injectable({ providedIn: 'root' })
export class MarcaApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/marcas`;

    getAll(): Observable<MarcaResponseDto[]> {
        return this.http.get<MarcaResponseDto[]>(this.url);
    }

    getById(id: number): Observable<MarcaResponseDto> {
        return this.http.get<MarcaResponseDto>(`${this.url}/${id}`);
    }

    create(dto: MarcaRequestDto): Observable<MarcaResponseDto> {
        return this.http.post<MarcaResponseDto>(this.url, dto);
    }

    update(id: number, dto: MarcaUpdateDto): Observable<MarcaResponseDto> {
        return this.http.put<MarcaResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
