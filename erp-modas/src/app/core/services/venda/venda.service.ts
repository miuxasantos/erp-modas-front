import { inject, Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { VendaApiService } from "./venda-api.service";
import { Venda } from "@core/models/venda.models";
import { ItemVenda } from "@core/models/dependentes/item-venda.model";
import { VendaRequestDto } from "@core/dtos/venda/venda-request.dto";
import { VendaUpdateDto } from "@core/dtos/venda/venda-update.dto";

@Injectable({ providedIn: 'root' })
export class VendaService {
    private readonly api = inject(VendaApiService);

    getAll(): Observable<Venda[]> {
        return this.api.getAll().pipe(
            map(dtos => dtos.map(dto => new Venda(dto)))
        );
    }

    getById(id: number): Observable<Venda> {
        return this.api.getById(id).pipe(
            map(dto => new Venda(dto))
        );
    }

    getItens(condicionalId: number): Observable<ItemVenda[]> {
        return this.api.getItens(condicionalId).pipe(
            map(dtos => dtos.map(dto => new ItemVenda(dto)))
        );
    }

    create(dto: VendaRequestDto): Observable<Venda> {
        return this.api.create(dto).pipe(
            map(dto => new Venda(dto))
        );
    }

    update(id: number, dto: VendaUpdateDto): Observable<Venda> {
        return this.api.update(id, dto).pipe(
            map(dto => new Venda(dto))
        );
    }

    delete(id: number): Observable<void> {
        return this.delete(id);
    }
}
