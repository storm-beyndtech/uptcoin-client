import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  BarData,
  ColorType,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import { useCrypto } from '@/context/CoinContext';

const TradingChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const barSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const { cryptoData } = useCrypto(); // Live trade updates

  const [candlestickData, setCandlestickData] = useState<BarData[]>([]);
  const CANDLE_INTERVAL = 10; // Create new candles every 10 seconds

  // Get the user's timezone offset in seconds
  const timezoneOffsetSeconds = new Date().getTimezoneOffset() * 60; // Convert to seconds

  /** ✅ Utility function to get the start date (7 days ago) */
  const getStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  /** 🔹 Fetch Historical Data from CoinGecko */
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol.toLowerCase()}USDT&interval=1h&limit=100`,
      );

      if (!response.ok) throw new Error('Failed to fetch historical data');

      const data = await response.json();

      console.log(data)

      const formattedData: BarData[] = data.map((item: any) => ({
        time: Math.floor(new Date(item.time_close).getTime() / 1000), // Convert to UNIX timestamp
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      setCandlestickData(formattedData);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [symbol]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.remove(); // ✅ Clears previous chart
      chartInstance.current = null;
    }

    if (chartRef.current) {
      chartInstance.current = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
        layout: {
          background: { type: ColorType.Solid, color: '#1a1b1c' },
          textColor: 'white',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
          rightOffset: 2,
        },
      });

      barSeries.current = chartInstance.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        priceScaleId: 'right',
      });

      chartInstance.current.timeScale().fitContent();
      chartInstance.current.timeScale().applyOptions({
        fixRightEdge: true, // Prevent extreme zoom-in
      });
      barSeries.current.setData([]);
    }
  }, [symbol]);

  /** 🔹 Update Chart with Historical Data */
  useEffect(() => {
    if (barSeries.current && candlestickData.length) {
      barSeries.current.setData(candlestickData);
    }
  }, [candlestickData]);

  /** 🔹 Update Real-Time Data */
  useEffect(() => {
    if (!cryptoData[symbol] || !barSeries.current) return;

    const { price, time: rawTime } = cryptoData[symbol];

    // Convert time to UTC and adjust for timezone offset
    const tradeTimeUTC = Math.floor(rawTime / 1000) - timezoneOffsetSeconds;

    setCandlestickData((prevData) => {
      const lastCandle = prevData[prevData.length - 1];

      if (
        lastCandle &&
        tradeTimeUTC - Number(lastCandle.time) < CANDLE_INTERVAL
      ) {
        return prevData.map((bar) =>
          bar.time === lastCandle.time
            ? {
                ...bar,
                high: Math.max(bar.high, price),
                low: Math.min(bar.low, price),
                close: price,
              }
            : bar,
        );
      } else {
        return [
          ...prevData,
          {
            time: tradeTimeUTC,
            open: price,
            high: price,
            low: price,
            close: price,
          } as BarData,
        ];
      }
    });
  }, [cryptoData, symbol]);

  return (
    <div className="w-full h-full max-sm:h-75 bg-bodydark2 p-5 rounded">
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default TradingChart;
