import { symbols } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  low: string;
  high: string;
  volume: string;
  image: string;
}

interface CryptoContextType {
  cryptoData: CryptoData[];
  refreshData: () => void;
}

export const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response");
      }

      // Process Data & Apply Margins
      const updatedData: CryptoData[] = symbols
        .map((item) => {
          const coin = data.find(
            (coin) => coin.symbol.toUpperCase() === item.symbol
          );
          return coin
            ? {
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: (coin.current_price * (1 + item.margin / 100)).toFixed(2),
                change: `${coin.price_change_percentage_24h.toFixed(2)}%`,
                low: coin.low_24h.toFixed(2),
                high: coin.high_24h.toFixed(2),
                volume: coin.total_volume.toLocaleString(),
                image: coin.image,
              }
            : null;
        })
        .filter(Boolean) as CryptoData[];

      setCryptoData(updatedData);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  useEffect(() => {
    fetchCryptoData(); // Initial Fetch

    // Fetch new data every 2 mins
    const interval = setInterval(fetchCryptoData, 120000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CryptoContext.Provider value={{ cryptoData, refreshData: fetchCryptoData }}>
      {children}
    </CryptoContext.Provider>
  );
};

// Hook for using Crypto Data
export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
};
