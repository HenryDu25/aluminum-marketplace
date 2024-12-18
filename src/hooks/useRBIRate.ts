import {useEffect, useState} from 'react';
import { MARKET_CONFIG } from '../config/market';
import axios from "axios";
import {load} from "cheerio";

export function useRBIRate() {
  const [rate, setRate] = useState<number>(MARKET_CONFIG.RBI.DEFAULT_RATE);
  const [lastUpdated] = useState<Date>(new Date());
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    axios.get("https://www.msei.in/markets/currency/historical-data/rbireferenceratearchives")
        .then(response => {
          const $ = load(response.data);
          const secondCell = $('table').first().find('tr').eq(2).find('td').eq(1).text().trim();
          setRate(parseFloat(secondCell));
        })
  }, []);

  return {
    rate,
    lastUpdated,
    loading,
    error
  };
}