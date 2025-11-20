import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">NewsGen Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold text-lg">Usuários</h2>
          <p className="text-3xl font-bold mt-2">842</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold text-lg">Receita (MRR)</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">R$ 12.4k</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold text-lg">Jobs na Fila</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">45</p>
        </div>
      </div>
    </div>
  );
}