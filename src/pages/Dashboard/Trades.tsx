import DisplayActiveTrade from "@/components/DisplayActiveTrade";
import Balance from "@/components/balance/Balance"
import { contextData } from "@/context/AuthContext"
import { useEffect, useState } from "react";

export default function Trades() {
  const [tradeData, setTradeData] = useState<any>([]);
  const { user } = contextData();
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL;

  const fetchTrades = async () => {
    try {
      const res = await fetch(`${url}/trades/user/${user._id}`);
      const data = await res.json();
  
      if (res.ok) {
        setTradeData(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    fetchTrades();
    console.log(tradeData)
  }, [tradeData.length]);


  return (
    <>
      <div className="w-full flex gap-5 my-4 max-[900px]:flex-col">
        <div className="flex-none">
          <Balance type="trade" user={user}/>
        </div>
      </div>

      {tradeData ? (
        <DisplayActiveTrade trades={tradeData} />
      ) : (
        <p>No trade data yet.</p>
      )}
    </>
  );
}
