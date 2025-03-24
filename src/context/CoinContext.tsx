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
}

interface CryptoContextType {
  cryptoData: Record<string, CryptoData>;
}

export const CryptoContext = createContext<CryptoContextType | undefined>(
  undefined,
);

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cryptoData, setCryptoData] = useState<Record<string, CryptoData>>({});
  let ws: WebSocket | null = null;

  const connectWebSocket = () => {
    ws = new WebSocket(import.meta.env.VITE_REACT_APP_SERVER_URL_BASE);
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      // console.log("New Update", newData)
  
      if (!newData.price || newData.price === 0) return; // Ignore empty updates
  
      setCryptoData((prevData) => ({
        ...prevData,
        [newData.symbol]: newData, // Update only the changed coin
      }));
    };


    ws.onclose = () => {
      console.log('WebSocket Disconnected. Reconnecting...');
      setTimeout(connectWebSocket, 5000);
    };
  };

  useEffect(() => {
    connectWebSocket()
    return () => {
      ws?.close();
    };
  }, []);

  return (
    <CryptoContext.Provider value={{ cryptoData }}>
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
