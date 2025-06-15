import React, { useState } from "react";
import axios from "axios";

export default function Cotacao() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData([]);

    const formatDate = (dateStr) => dateStr.replace(/-/g, "");

    try {
      const response = await axios.get(
        `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365`,
        {
          params: {
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
          },
        }
      );
      setData(response.data);
    } catch (err) {
      setError("Erro ao buscar dados da API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cotação USD-BRL</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Data Inicial:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Data Final:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {loading && <p className="mt-4">Carregando...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {data.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Resultados:</h2>
          <ul className="space-y-2">
            {data.map((item) => (
              <li key={item.timestamp} className="border p-2 rounded shadow">
                <p><strong>Data:</strong> {new Date(item.timestamp * 1000).toLocaleDateString()}</p>
                <p><strong>Alta:</strong> {item.high}</p>
                <p><strong>Baixa:</strong> {item.low}</p>
                <p><strong>Valor:</strong> {item.bid}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
