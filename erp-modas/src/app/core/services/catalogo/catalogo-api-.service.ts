import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CatalogoResponseDto } from "@core/dtos/catalogo/catalogo-response.dto";
import { PageableDto } from "@core/dtos/catalogo/pageable.dto";
import { environment } from "@env/environment";
import { first, Observable } from "rxjs";

export interface CatalogoFiltros {
    q?: string;
    categoriaId?: number;
    corId?: number;
    tamanhoId?: number;
}

@Injectable({ providedIn: 'root'})
export class CatalogoApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/publico/catalogo`;

    listar(page = 0, size = 20, filtros?:CatalogoFiltros): Observable<PageableDto<CatalogoResponseDto>> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size);
        
        if(filtros?.q) params = params.set('q', filtros.q);
        if(filtros?.categoriaId) params = params.set('categoriaId', filtros.categoriaId);
        if(filtros?.corId) params = params.set('corId', filtros.corId);
        if(filtros?.tamanhoId) params = params.set('tamanhoId', filtros.tamanhoId);

        return this.http.get<PageableDto<CatalogoResponseDto>>(this.url, {params});
    }

    buscarPorId(id: number): Observable<CatalogoResponseDto> {
        return this.http.get<CatalogoResponseDto>(`${this.url}/${id}`);
    }
}