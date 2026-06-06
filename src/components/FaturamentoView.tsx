import React, { useMemo } from 'react';
import { Rendimento, Gasto } from '../types';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, CalendarDays } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface Props {
  rendimentos: Rendimento[];
  gastos: Gasto[];
}

export function FaturamentoView({ rendimentos, gastos }: Props) {
  const dadosAgrupados = useMemo(() => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    let faturamentoHoje = 0;
    let gastosHoje = 0;
    let faturamentoMes = 0;
    let gastosMes = 0;

    const dataHojeStr = hoje.toLocaleDateString('pt-BR');

    rendimentos.forEach(r => {
      const dataRendimento = new Date(r.data);
      const dataStr = dataRendimento.toLocaleDateString('pt-BR');
      
      if (dataStr === dataHojeStr) {
        faturamentoHoje += r.valor;
      }
      if (dataRendimento >= inicioMes) {
        faturamentoMes += r.valor;
      }
    });

    gastos.forEach(g => {
      const dataGasto = new Date(g.data);
      const dataStr = dataGasto.toLocaleDateString('pt-BR');

      if (dataStr === dataHojeStr) {
        gastosHoje += g.valor;
      }
      if (dataGasto >= inicioMes) {
        gastosMes += g.valor;
      }
    });

    return {
      faturamentoHoje,
      gastosHoje,
      lucroHoje: faturamentoHoje - gastosHoje,
      faturamentoMes,
      gastosMes,
      lucroMes: faturamentoMes - gastosMes
    };
  }, [rendimentos, gastos]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-white">Resumo de Faturamento</h2>
      </div>

      <div className="bg-[#202024] p-5 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
          <CalendarDays className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-200">Hoje</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#121214] p-3 rounded border border-gray-800 flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-green-500" /> Receita
            </span>
            <span className="font-mono text-green-500 font-bold">{formatCurrency(dadosAgrupados.faturamentoHoje)}</span>
          </div>
          <div className="bg-[#121214] p-3 rounded border border-gray-800 flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <TrendingDown className="w-3 h-3 text-red-500" /> Gastos
            </span>
            <span className="font-mono text-red-500 font-bold">{formatCurrency(dadosAgrupados.gastosHoje)}</span>
          </div>
        </div>
        
        <div className="bg-[#121214] p-4 rounded border border-gray-800 flex justify-between items-center">
          <span className="text-sm text-gray-400 font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            Lucro (Hoje)
          </span>
          <span className={`font-mono text-xl font-bold ${dadosAgrupados.lucroHoje >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(dadosAgrupados.lucroHoje)}
          </span>
        </div>
      </div>

      <div className="bg-[#202024] p-5 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
          <CalendarDays className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-200">Este Mês</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#121214] p-3 rounded border border-gray-800 flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-green-500" /> Receita
            </span>
            <span className="font-mono text-green-500 font-bold">{formatCurrency(dadosAgrupados.faturamentoMes)}</span>
          </div>
          <div className="bg-[#121214] p-3 rounded border border-gray-800 flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <TrendingDown className="w-3 h-3 text-red-500" /> Gastos
            </span>
            <span className="font-mono text-red-500 font-bold">{formatCurrency(dadosAgrupados.gastosMes)}</span>
          </div>
        </div>
        
        <div className="bg-[#121214] p-4 rounded border border-gray-800 flex justify-between items-center">
          <span className="text-sm text-gray-400 font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            Lucro (Mês)
          </span>
          <span className={`font-mono text-xl font-bold ${dadosAgrupados.lucroMes >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(dadosAgrupados.lucroMes)}
          </span>
        </div>
      </div>
    </div>
  );
}
