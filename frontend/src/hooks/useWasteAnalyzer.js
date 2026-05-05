import { useState } from "react";
import { analyzeWaste, analyzeWasteImage } from "../utils/api";

export function useWasteAnalyzer() {
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState(null);
  const [history, setHistory]     = useState([]);
  const [stats, setStats]         = useState({
    analyzed: 0, recyclable: 0, hazardous: 0, compostable: 0
  });

  async function analyze(input) {
    if (!input) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data;
      let historyItem;

      if (input instanceof File) {
        // Image Analysis
        const formData = new FormData();
        formData.append('image', input);
        data = await analyzeWasteImage(formData);
        historyItem = { input: "Image Scan", ...data };
      } else {
        // Text Analysis
        if (!input.trim()) return;
        data = await analyzeWaste(input);
        historyItem = { input: input, ...data };
      }

      setResult(data);
      setHistory(prev => [historyItem, ...prev].slice(0, 5));
      setStats(prev => ({
        analyzed:    prev.analyzed + 1,
        recyclable:  prev.recyclable  + (data.category === "Recyclable"  ? 1 : 0),
        hazardous:   prev.hazardous   + (data.category === "Hazardous"   ? 1 : 0),
        compostable: prev.compostable + (data.category === "Compostable" ? 1 : 0),
      }));
    } catch (e) {
      setError(e.message || "Eco-sync failed. Please check your signal (API Key) and try again.");
    } finally {
      setLoading(false);
    }
  }

  return { loading, result, error, history, stats, analyze };
}
