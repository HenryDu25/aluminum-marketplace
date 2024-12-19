import { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from 'cheerio';

interface MCXPriceData {
  price: number;
  lastUpdated: string;
  changePercent: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  currentPrice: number;
}

export function useMCXPrice() {
  const [priceData, setPriceData] = useState<MCXPriceData>({
    price: 241.45,
    currentPrice: 241.45,
    lastUpdated: new Date().toISOString(),
    changePercent: 0.15,
    volume: 1580,
    dayHigh: 242.30,
    dayLow: 240.80
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMCXPrice = async () => {
    setLoading(true);
    try {
      const url = 'https://www.5paisa.com/commodity-trading/mcx-aluminium-price';
      const response = await axios.get(url);
      const $ = load(response.data);

      // Get the main price element
      const priceText = $('.commodity-page__value').first().text().trim();
      const currentPrice = parseFloat((priceText).replace(/₹|,/g, ''));

      // Get the change values
      const changeText = $('.commodity-page__percentage').first().text().trim();
      const [change, changePercent] = changeText.match(/-?\d+(\.\d+)?/g)!.map(parseFloat);

      // Get the last updated date
      const lastUpdatedText = $('.commodity-page__date').first().text().trim();
      const dateTimeParts = lastUpdatedText.replace('As on ', '').split('|');
      const datePart = dateTimeParts[0].trim();
      const timePart = dateTimeParts[1].trim();
      const [day, month, year] = datePart.replace(',', '').split(' ');
      const monthMap: { [key: string]: string } = {
        January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
        July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
      };
      const formattedDate = `${year}-${monthMap[month]}-${day}T${timePart}:00`;
      const lastUpdated = new Date(formattedDate).toISOString();

      // Get the day high and low values
      const dayLow = parseFloat($('#low').text().trim());
      const dayHigh = parseFloat($('#high').text().trim());

      setPriceData({
        currentPrice,
        price: currentPrice,
        lastUpdated,
        changePercent,
        volume: 0, // Volume is not available in the provided HTML
        dayHigh,
        dayLow
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCXPrice();
    const intervalId = setInterval(fetchMCXPrice, 20000); // 20 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return { priceData, error, loading, fetchMCXPrice };
}