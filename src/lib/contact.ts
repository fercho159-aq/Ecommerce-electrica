export const WHATSAPP_NUMBER = "525517896003";

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
