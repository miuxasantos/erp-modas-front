import { HttpClient, HttpParams, HttpContext } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CatalogoFiltrosDto } from "@core/dtos/catalogo/catalogo-filtros.dto";
import { CatalogoResponseDto } from "@core/dtos/catalogo/catalogo-response.dto";
import { PageableDto } from "@core/dtos/catalogo/pageable.dto";
import { STATUS_TELA } from "@core/interceptors/http-context.interceptor";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

export interface filtros {
    q?: string;
    categoriaId?: number;
    corId?: number;
    tamanhoId?: number;
    sort?: string;
}

@Injectable({ providedIn: 'root'})
export class CatalogoApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/publico/catalogo`;

    listar(page = 0, size = 20, filtros?:filtros): Observable<PageableDto<CatalogoResponseDto>> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size);
        
        if(filtros?.q) params = params.set('q', filtros.q);
        if(filtros?.categoriaId) params = params.set('categoriaId', filtros.categoriaId);
        if(filtros?.corId) params = params.set('corId', filtros.corId);
        if(filtros?.tamanhoId) params = params.set('tamanhoId', filtros.tamanhoId);
        if (filtros?.sort) params = params.set('sort', filtros.sort);
        return this.http.get<PageableDto<CatalogoResponseDto>>(this.url, {params});
    }

    filtros(): Observable<CatalogoFiltrosDto> {
        return this.http.get<CatalogoFiltrosDto>(`${this.url}/filtros`);
    }

    buscarPorId(id: number): Observable<CatalogoResponseDto> {
        const context = new HttpContext().set(STATUS_TELA, [404]);
        return this.http.get<CatalogoResponseDto>(`${this.url}/${id}`, { context });
    }
}