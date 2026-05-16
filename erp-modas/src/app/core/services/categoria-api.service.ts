import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { CategoriaResponseDto } from "@core/dtos/categoria/categoria-response.dto";
import { CategoriaRequestDto } from "@core/dtos/categoria/categoria-request.dto";
import { CategoriaUpdateDto } from "@core/dtos/categoria/categoria-update.dto";

@Injectable({providedIn: 'root'})
export class CategoriaApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/categorias`;

    getAll(): Observable<CategoriaResponseDto[]> {
        return this.http.get<CategoriaResponseDto[]>(this.url);
    }

    getById(id: number): Observable<CategoriaResponseDto> {
        return this.http.get<CategoriaResponseDto>(`${this.url}/${id}`);
    }

    create(dto: CategoriaRequestDto): Observable<CategoriaResponseDto> {
        return this.http.post<CategoriaResponseDto>(this.url, dto);
    }

    update(id: number, dto: CategoriaUpdateDto): Observable<CategoriaResponseDto> {
        return this.http.put<CategoriaResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}