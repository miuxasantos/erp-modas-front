import { inject, Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { CondicionalApiService } from "./condicional-api.service";
import { Condicional } from "@core/models/condicional.model";
import { ItemCondicional } from "@core/models/dependentes/item-condicional.model";
import { CondicionalRequestDto } from "@core/dtos/condicional/condicional-request.dto";
import { CondicionalUpdateDto } from "@core/dtos/condicional/condicional-update.dto";

@Injectable({ providedIn: 'root' })
export class CondicionalService {
    private readonly api = inject(CondicionalApiService);

    getAll(): Observable<Condicional[]> {
        return this.api.getAll().pipe(
            map(dtos => dtos.map(dto => new Condicional(dto)))
        );
    }

    getById(id: number): Observable<Condicional> {
        return this.api.getById(id).pipe(
            map(dto => new Condicional(dto))
        );
    }

    getItens(condicionalId: number): Observable<ItemCondicional[]> {
        return this.api.getItens(condicionalId).pipe(
            map(dtos => dtos.map(dto => new ItemCondicional(dto)))
        );
    }

    create(dto: CondicionalRequestDto): Observable<Condicional> {
        return this.api.create(dto).pipe(
            map(dto => new Condicional(dto))
        );
    }

    update(id: number, dto: CondicionalUpdateDto): Observable<Condicional> {
        return this.api.update(id, dto).pipe(
            map(dto => new Condicional(dto))
        );
    }

    delete(id: number): Observable<void> {
        return this.delete(id);
    }
}
