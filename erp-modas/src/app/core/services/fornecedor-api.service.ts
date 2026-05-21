import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { FornecedorResponseDto } from "@core/dtos/fornecedor/fornecedor-response.dto";
import { FornecedorRequestDto } from "@core/dtos/fornecedor/fornecedor-request.dto";
import { FornecedorUpdateDto } from "@core/dtos/fornecedor/fornecedor-update.dto";

@Injectable({ providedIn: 'root' })
export class FornecedorApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/fornecedores`;

    getAll(): Observable<FornecedorResponseDto[]> {
        return this.http.get<FornecedorResponseDto[]>(this.url);
    }

    getById(id: number): Observable<FornecedorResponseDto> {
        return this.http.get<FornecedorResponseDto>(`${this.url}/${id}`);
    }

    create(dto: FornecedorRequestDto): Observable<FornecedorResponseDto> {
        return this.http.post<FornecedorResponseDto>(this.url, dto);
    }

    update(id: number, dto: FornecedorUpdateDto): Observable<FornecedorResponseDto> {
        return this.http.put<FornecedorResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
