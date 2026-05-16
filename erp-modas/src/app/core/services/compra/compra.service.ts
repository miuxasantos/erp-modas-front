import { inject, Injectable, signal } from "@angular/core";
import { Compra } from "@core/models/compra.model";
import { map, Observable, tap } from "rxjs";
import { CompraApiService } from "./compra-api.service";
import { CompraRequestDto } from "@core/dtos/compra/compra-request.dto";
import { ItemCompra } from "@core/models/dependentes/item-compra.model";
import { CompraUpdateDto } from "@core/dtos/compra/compra-update.dto";

@Injectable({ providedIn: 'root' })
export class CompraService {
    private readonly api = inject(CompraApiService);

    getAll(): Observable<Compra[]> {
        return this.api.getAll().pipe(
            map(dtos => dtos.map(dto => new Compra(dto)))
        );
    }

    getById(id: number): Observable<Compra> {
        return this.api.getById(id).pipe(
            map(dto => new Compra(dto))
        );
    }

    getItens(compraId: number): Observable<ItemCompra[]> {
        return this.api.getItens(compraId).pipe(
            map(dtos => dtos.map(dto => new ItemCompra(dto)))
        );
    }

    create(dto: CompraRequestDto): Observable<Compra> {
        return this.api.create(dto).pipe(
            map(dto => new Compra(dto))
        );
    }

    update(id: number, dto: CompraUpdateDto): Observable<Compra> {
        return this.api.update(id, dto).pipe(
            map(dto => new Compra(dto))
        );
    }

    delete(id: number): Observable<void> {
        return this.delete(id);
    }
}
