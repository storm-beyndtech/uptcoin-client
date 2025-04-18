import { sendRequest } from '@/lib/sendRequest';
import { ISymbol } from '@/lib/utils';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  low: number;
  high: number;
  volume: number;
  image: string;
  time: number;
  address: string;
  network: string;
  withdrawalFee: number;
  conversionFee: number;
  minDeposit: number;
  minWithdraw: number;
}

interface CryptoContextType {
  cryptoData: Record<string, CryptoData>;
  symbols: ISymbol[];
}

export const CryptoContext = createContext<CryptoContextType | undefined>(
  undefined,
);

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cryptoData, setCryptoData] = useState<Record<string, CryptoData>>({});
  const [symbols, setSymbols] = useState<ISymbol[]>([]);
  const [isSymbolsFetched, setIsSymbolsFetched] = useState(false);
  let ws: WebSocket | null = null;

  // Extract symbols from assets dynamically
  const coinOrder: string[] = symbols.map((coin) => coin.symbol);

  //Fetch symbols
  const fetchSymbols = async () => {
    try {
      const data = await sendRequest('/coins', 'GET');
      setSymbols(data);
      setIsSymbolsFetched(true);
    } catch (error) {
      console.log('error fetching symbols', error);
    }
  };

  const connectWebSocket = () => {
    ws = new WebSocket(import.meta.env.VITE_REACT_APP_SERVER_URL_BASE);

    ws.onmessage = (event) => {
      try {
        const newData: CryptoData = JSON.parse(event.data);

        if (!newData.symbol || !newData.price || newData.price === 0) return; // Ignore empty updates

        setCryptoData((prevData) => {
          const updatedData = {
            ...prevData,
            [newData.symbol]: newData, // Update only the changed coin
          };

          // Sort based on predefined order
          const sortedDataArray = Object.values(updatedData).sort((a, b) => {
            const indexA = coinOrder.indexOf(a.symbol);
            const indexB = coinOrder.indexOf(b.symbol);

            // If not found in the order list, push them to the end
            return (
              (indexA !== -1 ? indexA : coinOrder.length) -
              (indexB !== -1 ? indexB : coinOrder.length)
            );
          });

          // Convert sorted array back to an object
          return sortedDataArray.reduce(
            (acc, coin) => {
              acc[coin.symbol] = coin;
              return acc;
            },
            {} as Record<string, CryptoData>,
          );
        });
      } catch (error) {
        console.error('WebSocket Data Parsing Error:', error);
      }
    };

    ws.onclose = () => {
      console.warn('WebSocket Disconnected. Reconnecting...');
      setTimeout(connectWebSocket, 5000);
    };
  };

  useEffect(() => {
    fetchSymbols();
  }, []);

  useEffect(() => {
    if (!isSymbolsFetched) return;
    connectWebSocket();
    return () => {
      ws?.close();
    };
  }, [isSymbolsFetched, symbols]);

  return (
    <CryptoContext.Provider value={{ cryptoData, symbols }}>
      {children}
    </CryptoContext.Provider>
  );
};

// Hook for using Crypto Data
export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};
