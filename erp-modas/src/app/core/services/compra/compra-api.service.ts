import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { CompraResponseDto } from "@core/dtos/compra/compra-response.dto";
import { CompraRequestDto } from "@core/dtos/compra/compra-request.dto";
import { CompraUpdateDto } from "@core/dtos/compra/compra-update.dto";
import { ItemCompraResponseDto } from "@core/dtos/itemCompra/item-compra-response.dto";

@Injectable({ providedIn: 'root' })
export class CompraApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/compras`;

    getAll(): Observable<CompraResponseDto[]> {
        return this.http.get<CompraResponseDto[]>(this.url);
    }

    getById(id: number): Observable<CompraResponseDto> {
        return this.http.get<CompraResponseDto>(`${this.url}/${id}`);
    }

    getItens(compraId: number): Observable<ItemCompraResponseDto[]> {
        return this.http.get<ItemCompraResponseDto[]>(`${this.url}/${compraId}/itens`);
    }

    create(dto: CompraRequestDto): Observable<CompraResponseDto> {
        return this.http.post<CompraResponseDto>(this.url, dto);
    }

    update(id: number, dto: CompraUpdateDto): Observable<CompraResponseDto> {
        return this.http.put<CompraResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
