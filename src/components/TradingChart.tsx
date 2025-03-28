import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  BarData,
} from 'lightweight-charts';
import { useCrypto } from '@/context/CoinContext';

const TIMEFRAMES = {
  '1D': 'histohour',
  '7D': 'histoday',
};

const TradingChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const barSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const { cryptoData } = useCrypto();
  // Get the user's timezone offset in seconds
  const timezoneOffsetSeconds = new Date().getTimezoneOffset() * 60;

  const [candlestickData, setCandlestickData] = useState([]);
  const [timeframe, setTimeframe] = useState<'1D' | '7D'>('7D');

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/v2/${
          TIMEFRAMES[timeframe]
        }?fsym=${symbol.toUpperCase()}&tsym=USD&limit=500`,
      );
      if (!response.ok) throw new Error('Failed to fetch historical data');

      const data = await response.json();
      if (data.Response !== 'Success') throw new Error('Invalid data response');

      const formattedData = data.Data.Data.map((item: any) => ({
        time: item.time,
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
  }, [symbol, timeframe]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.remove();
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
          secondsVisible: timeframe === '1D',
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
      });
      chartInstance.current.timeScale().fitContent();
    }
  }, [symbol, timeframe]);

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

    setCandlestickData((prevData: any) => {
      const lastCandle = prevData[prevData.length - 1];

      if (
        lastCandle &&
        tradeTimeUTC - Number(lastCandle.time) <
          (timeframe === '1D' ? 86400 : 604800)
      ) {
        return prevData.map((bar: any) =>
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
    <div className="w-full h-90 bg-bodydark2 p-2 sm:p-4 rounded mb-5 relative">
      <div className="flex gap-3 absolute top-5 left-4 z-9">
        {Object.keys(TIMEFRAMES).map((tf) => (
          <button
            key={tf}
            className={`px-5 py-[2px] text-sm rounded-full ${
              timeframe === tf
                ? 'bg-blue-500 text-white'
                : 'bg-bodydark text-gray-300'
            }`}
            onClick={() => setTimeframe(tf as '1D' | '7D')}
          >
            {tf}
          </button>
        ))}
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TradingChart;
