import React, { useMemo, useState } from 'react';
import { Send, User, Building, Bot } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import InteractiveBarChart from '../components/charts/InteractiveBarChart';
import InteractivePieChart from '../components/charts/InteractivePieChart';
import LineChart from '../components/charts/LineChart';
import { useChatbot } from '../hooks/useChatbot';

export default function ResearchAI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'friend' | 'business'>('business');
  const { messages, isTyping, error, lastResult, sendMessage } = useChatbot();

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    await sendMessage(text, mode);
  };

  const handleSuggestion = (text: string, newMode: 'friend' | 'business') => {
    setMode(newMode);
    setInput(text);
  };

  const tableColumns = useMemo(() => {
    if (!lastResult?.table?.columns) return [];
    return lastResult.table.columns.map((column) => ({
      accessorKey: column,
      header: column,
    }));
  }, [lastResult]);

  const tableRows = useMemo(() => {
    if (!lastResult?.table) return [];
    const { columns, rows } = lastResult.table;
    return rows.map((row) =>
      Object.fromEntries(columns.map((column, idx) => [column, row[idx] ?? null]))
    );
  }, [lastResult]);

  const chart = lastResult?.chart;
  const hasTable = tableColumns.length > 0;
  const hasChart = Boolean(chart);
  const hasStructuredResult = hasTable || hasChart;
  const hasCompletedResponse = Boolean(lastResult);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-5 gap-6">
      <section className="lg:col-span-3 bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col min-h-[70vh]">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-display font-bold text-primary-900 flex items-center gap-3">
            <Bot className="text-yelp-red" size={30} />
            Research AI Assistant
          </h1>
          <p className="text-primary-700 mt-2">Connected for backend natural-language analytics responses.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-yelp-red text-white rounded-br-none' : 'bg-white shadow text-primary-900 rounded-bl-none border border-primary-100'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="text-sm text-primary-700 italic">AI is processing your query...</div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('business')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'business' ? 'bg-yelp-red text-white' : 'bg-gray-100 text-primary-700 hover:bg-primary-100'}`}
            >
              <Building size={16} /> Business Recommendation
            </button>
            <button
              onClick={() => setMode('friend')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'friend' ? 'bg-primary-700 text-white' : 'bg-gray-100 text-primary-700 hover:bg-primary-100'}`}
            >
              <User size={16} /> Friend Recommendation
            </button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button onClick={() => handleSuggestion('Find me the most popular restaurants', 'business')} className="whitespace-nowrap text-xs bg-white border border-primary-200 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100">Find me the most popular restaurants</button>
            <button onClick={() => handleSuggestion('Who are the most active reviewers?', 'friend')} className="whitespace-nowrap text-xs bg-white border border-primary-200 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100">Who are the most active reviewers?</button>
            <button onClick={() => handleSuggestion('Suggest top rated coffee shops', 'business')} className="whitespace-nowrap text-xs bg-white border border-primary-200 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100">Suggest top rated coffee shops</button>
          </div>

          <div className="flex gap-3 w-full">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask for a ${mode} recommendation...`}
              className="flex-1 border border-primary-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yelp-red"
            />
            <button onClick={handleSend} className="bg-yelp-red text-white p-3 rounded-lg hover:bg-yelp-red-dark transition" disabled={isTyping}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </section>

      <aside className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-200 p-4 overflow-auto">
        <h2 className="text-xl font-display font-bold text-primary-900 mb-4">Structured Result</h2>

        {hasStructuredResult ? (
          <>
            {hasChart && (
              <div className="mb-6">
                {chart!.type === 'pie' ? (
                  <InteractivePieChart data={chart!} title={chart!.title || 'Backend Chart'} height={300} />
                ) : chart!.type === 'line' ? (
                  <div style={{ height: 300 }}>
                    <LineChart data={chart!} options={{ plugins: { legend: { display: true } } }} />
                  </div>
                ) : (
                  <InteractiveBarChart data={chart!} title={chart!.title || 'Backend Chart'} height={300} />
                )}
              </div>
            )}

            {hasTable && <DataTable data={tableRows} columns={tableColumns as any} />}
          </>
        ) : (
          hasCompletedResponse && (
            <p className="text-sm text-primary-700">No structured result in the latest response.</p>
          )
        )}
      </aside>
    </div>
  );
}
