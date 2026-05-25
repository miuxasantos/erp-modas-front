import { inject, Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { ProdutoApiService } from "./produto-api.service";
import { Produto } from "@core/models/produto.model";
import { ProdutoRequestDto } from "@core/dtos/produto/produto-request.dto";
import { ProdutoResponseDto } from "@core/dtos/produto/produto-response.dto";

@Injectable({ providedIn: 'root' })
export class ProdutoService {
    private readonly api = inject(ProdutoApiService);

    getAll(): Observable<Produto[]> {
        return this.api.getAll().pipe(
            map(dtos => dtos.map(dto => new Produto(dto)))
        );
    }

    getById(id: number): Observable<Produto> {
        return this.api.getById(id).pipe(
            map(dto => new Produto(dto))
        );
    }

    create(dto: ProdutoResponseDto): Observable<Produto> {
        return this.api.create(dto).pipe(
            map(dto => new Produto(dto))
        );
    }

    update(id: number, dto: ProdutoResponseDto): Observable<Produto> {
        return this.api.update(id, dto).pipe(
            map(dto => new Produto(dto))
        );
    }

    delete(id: number): Observable<void> {
        return this.delete(id);
    }
}
