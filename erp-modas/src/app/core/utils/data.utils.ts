import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Data local em yyyy-MM-dd.
 * Não usar new Date().toISOString().split('T')[0]: o toISOString converte para UTC,
 * então depois das 21h (horário de Brasília) ele já devolve o dia seguinte.
 */
export function dataLocalISO(data: Date = new Date()): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

export function primeiroDiaDoMesISO(data: Date = new Date()): string {
    return dataLocalISO(new Date(data.getFullYear(), data.getMonth(), 1));
}

/**
 * Validador de grupo: início <= fim.
 * Comparar as strings funciona porque yyyy-MM-dd tem a mesma ordem da data.
 * Mesma regra que o backend valida, aqui só evita a ida ao servidor.
 */
export function periodoValidoValidator(campoInicio = 'inicio', campoFim = 'fim'): ValidatorFn {
    return (grupo: AbstractControl): ValidationErrors | null => {
        const inicio = grupo.get(campoInicio)?.value;
        const fim = grupo.get(campoFim)?.value;

        if (!inicio || !fim) {
            return null;
        }
        return inicio <= fim ? null : { periodoInvalido: true };
    };
}