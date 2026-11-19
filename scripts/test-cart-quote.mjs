// Autoprueba: node scripts/test-cart-quote.mjs (extrae cartQuoteText de products.ts)
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import assert from "node:assert/strict";
const src = readFileSync(new URL("../src/data/products.ts", import.meta.url), "utf8");
const fn = src.match(/export function cartQuoteText[\s\S]*?\n}\n/)[0].replace("export ", "");
const cartQuoteText = new Function(stripTypeScriptTypes(fn) + "; return cartQuoteText;")();
const items = [
  { quantity: 2, name: "Cable 12", brand: "Condumex", sku: "C12" },
  { quantity: 1, name: "Apagador", brand: "Bticino", sku: "A1" },
];
assert.equal(
  cartQuoteText(items),
  "Hola, deseo cotizar los siguientes productos:\n\n*2 pza — Cable 12*\nMarca: Condumex · SKU: C12\n\n*1 pza — Apagador*\nMarca: Bticino · SKU: A1\n"
);
console.log("ok");
