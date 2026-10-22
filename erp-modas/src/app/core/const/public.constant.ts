export const LOJA = {
    nome: 'Shirleys Modas',
    whatsapp: '5544999154836',
    instagram: 'https://www.instagram.com/shirleysmodapvai?stkn=eGptczdtMXBxaHQz',
    email: 'shirleysmodas@gmail.com',
} as const;

export function linkWhatsapp(mensagem?: string): string {
    const base = `https://wa.me/${LOJA.whatsapp}`;
    return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}