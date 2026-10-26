import { Pipe, PipeTransform } from '@angular/core';

export type MascaraPreset = 'cpf' | 'cnpj' | 'documento' | 'telefone' | 'cep';

const PADROES = {
  cpf: '000.000.000-00',
  cnpj: '00.000.000/0000-00',
  cep: '00000-000',
  celular: '(00) 00000-0000',
  fixo: '(00) 0000-0000',
};

@Pipe({ name: 'mascara' })
export class MascaraPipe implements PipeTransform {

  transform(valor: string | number | null | undefined, mascara: MascaraPreset | string): string {
    if (valor === null || valor === undefined || valor === '') return '';

    const digitos = String(valor).replace(/\D/g, '');
    const padrao = this.resolverPadrao(mascara, digitos.length);

    return this.aplicar(digitos, padrao) ?? String(valor);
  }

  private resolverPadrao(mascara: string, tamanho: number): string {
    switch (mascara) {
      case 'cpf':       return PADROES.cpf;
      case 'cnpj':      return PADROES.cnpj;
      case 'cep':       return PADROES.cep;
      case 'documento': return tamanho === 14 ? PADROES.cnpj : PADROES.cpf;
      case 'telefone':  return tamanho === 11 ? PADROES.celular : PADROES.fixo;
      default:          return mascara; // padrão livre, ex: '0000-0000'
    }
  }

  private aplicar(digitos: string, padrao: string): string | null {
    const slots = (padrao.match(/0/g) ?? []).length;
    if (digitos.length !== slots) return null; // não bate → não formata

    let i = 0;
    return padrao.replace(/0/g, () => digitos[i++]);
  }
}