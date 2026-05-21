import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ProdutoResponseDto } from "@core/dtos/produto/produto-response.dto";
import { ProdutoUpdateDto } from "@core/dtos/produto/produto-update.dto";

@Injectable({ providedIn: 'root' })
export class ProdutoApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/produtos`;

    getAll(): Observable<ProdutoResponseDto[]> {
        return this.http.get<ProdutoResponseDto[]>(this.url);
    }

    getById(id: number): Observable<ProdutoResponseDto> {
        return this.http.get<ProdutoResponseDto>(`${this.url}/${id}`);
    }

    create(dto: ProdutoResponseDto): Observable<ProdutoResponseDto> {
        return this.http.post<ProdutoResponseDto>(this.url, dto);
    }

    update(id: number, dto: ProdutoUpdateDto): Observable<ProdutoResponseDto> {
        return this.http.put<ProdutoResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
