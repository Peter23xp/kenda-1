import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Récupère le prix de l'ADA en USD via CoinGecko
 */
async function getAdaPriceInUsd(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd"
    );
    const data = await response.json();
    return data.cardano.usd;
  } catch (error) {
    console.error("Erreur récupération prix ADA:", error);
    //Fallback au cas ou l'API échouerait (1 ADA = 1 USD par défaut pour ne pas bloquer)
    return 1;
  }
}

/**
 * Convertit un montant USD (ex: "80 USD") en Lovelace (string)
 * en utilisant le taux de change actuel.
 */
export async function convertToLovelace(amountStr: string): Promise<string> {
  // 1. Nettoyer le montant (ex: "80")
  const cleanAmount = amountStr.replace(/[^0-9.]/g, '');
  const amountInUsd = parseFloat(cleanAmount);

  if (isNaN(amountInUsd)) return "0";

  // 2. Récupérer le prix de l'ADA (ex: 0.40$)
  const adaPrice = await getAdaPriceInUsd();

  // 3. Convertir USD -> ADA
  // Ex: 80$ / 0.40$ = 200 ADA
  const amountInAda = amountInUsd / adaPrice;

  console.log(`💱 Conversion: ${amountInUsd}$ @ ${adaPrice}$/ADA = ${amountInAda} ADA`);

  // 4. Convertir ADA -> Lovelace
  return Math.floor(amountInAda * 1000000).toString();
}
