import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { VariacaoProdutoUpdateDto } from "@core/dtos/variacaoProduto/variacao-produto-update.dto";
import { VariacaoProdutoResponseDto } from "@core/dtos/variacaoProduto/variacao-produto-response.dto";
import { VariacaoProdutoRequestDto } from "@core/dtos/variacaoProduto/variacao-produto-request.dto";

@Injectable({ providedIn: 'root' })
export class VariacaoProdutoApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/produtos`;

    getAll(produtoId: number): Observable<VariacaoProdutoResponseDto[]> {
        return this.http.get<VariacaoProdutoResponseDto[]>(`${this.url}/${produtoId}/variacoes`);
    }

    getById(produtoId: number, variacaoId: number): Observable<VariacaoProdutoResponseDto> {
        return this.http.get<VariacaoProdutoResponseDto>(`${this.url}/${produtoId}/variacoes/${variacaoId}`);
    }

    create(produtoId: number, dto: VariacaoProdutoRequestDto): Observable<VariacaoProdutoResponseDto> {
        return this.http.post<VariacaoProdutoResponseDto>(`${this.url}/${produtoId}/variacoes`, dto);
    }

    update(produtoId: number, variacaoId: number, dto: VariacaoProdutoUpdateDto): Observable<VariacaoProdutoResponseDto> {
        return this.http.put<VariacaoProdutoResponseDto>(`${this.url}/${produtoId}/variacoes/${variacaoId}`, dto);
    }

    delete(produtoId: number, variacaoId: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${produtoId}/variacoes/${variacaoId}`);
    }
}
