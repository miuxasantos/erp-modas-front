import { HttpContextToken } from "@angular/common/http";

export const STATUS_TELA = new HttpContextToken<number[]>(() => []);