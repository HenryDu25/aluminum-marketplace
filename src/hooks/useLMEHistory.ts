import { useState, useEffect } from 'react';
import { LMEHistoryData } from '../types/market';
import { mockLMEHistory } from '../services/mockData';
import axios from "axios";
import {load} from "cheerio";

export function useLMEHistory() {
  const [data, setData] = useState<LMEHistoryData[]>(mockLMEHistory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios.get("https://www.westmetall.com/en/markdaten.php?action=table&field=LME_Al_cash")
        .then(response => {
            const $ = load(response.data);
            const tableRows = $('table').first().find('tr').toArray();
            const parsedData = tableRows.map(row => {
                const cells = $(row).find('td').toArray();
                return {
                    date: $(cells[0]).text().trim().replace(".", ""),
                    price: parseFloat($(cells[1]).text().trim().replace(",", ""))
                };
            }).filter(item => item.date && !isNaN(item.price));

            // Calculate the change based on the previous day's price
            for (let i = 0; i < parsedData.length-1; i++) {
                parsedData[i].previousDayPrice = parsedData[i + 1].price;
            }

            parsedData.pop()

            setData(parsedData);
            setLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

  return { data, loading, error };
}