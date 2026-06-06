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

    const resumoPorMes: Record<string, { faturamento: number; gastos: number; lucro: number }> = {};
    const resumoPorDia: Record<string, { faturamento: number; gastos: number; lucro: number }> = {};

    const dataHojeStr = hoje.toLocaleDateString('pt-BR');

    rendimentos.forEach(r => {
      const dataRendimento = new Date(r.data);
      const dataStr = dataRendimento.toLocaleDateString('pt-BR');
      
      const isoMes = `${dataRendimento.getFullYear()}-${String(dataRendimento.getMonth() + 1).padStart(2, '0')}`;
      const isoDia = `${dataRendimento.getFullYear()}-${String(dataRendimento.getMonth() + 1).padStart(2, '0')}-${String(dataRendimento.getDate()).padStart(2, '0')}`;

      if (dataStr === dataHojeStr) {
        faturamentoHoje += r.valor;
      }
      if (dataRendimento >= inicioMes) {
        faturamentoMes += r.valor;
      }

      if (!resumoPorMes[isoMes]) resumoPorMes[isoMes] = { faturamento: 0, gastos: 0, lucro: 0 };
      resumoPorMes[isoMes].faturamento += r.valor;
      resumoPorMes[isoMes].lucro += r.valor;

      if (!resumoPorDia[isoDia]) resumoPorDia[isoDia] = { faturamento: 0, gastos: 0, lucro: 0 };
      resumoPorDia[isoDia].faturamento += r.valor;
      resumoPorDia[isoDia].lucro += r.valor;
    });

    gastos.forEach(g => {
      const dataGasto = new Date(g.data);
      const dataStr = dataGasto.toLocaleDateString('pt-BR');

      const isoMes = `${dataGasto.getFullYear()}-${String(dataGasto.getMonth() + 1).padStart(2, '0')}`;
      const isoDia = `${dataGasto.getFullYear()}-${String(dataGasto.getMonth() + 1).padStart(2, '0')}-${String(dataGasto.getDate()).padStart(2, '0')}`;

      if (dataStr === dataHojeStr) {
        gastosHoje += g.valor;
      }
      if (dataGasto >= inicioMes) {
        gastosMes += g.valor;
      }

      if (!resumoPorMes[isoMes]) resumoPorMes[isoMes] = { faturamento: 0, gastos: 0, lucro: 0 };
      resumoPorMes[isoMes].gastos += g.valor;
      resumoPorMes[isoMes].lucro -= g.valor;

      if (!resumoPorDia[isoDia]) resumoPorDia[isoDia] = { faturamento: 0, gastos: 0, lucro: 0 };
      resumoPorDia[isoDia].gastos += g.valor;
      resumoPorDia[isoDia].lucro -= g.valor;
    });

    const historicoMeses = Object.entries(resumoPorMes)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([mes, valores]) => {
        const [ano, m] = mes.split('-');
        const nomeMes = new Date(parseInt(ano), parseInt(m) - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        return { nomeMes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1), ...valores };
      });

    const historicoDias = Object.entries(resumoPorDia)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([dia, valores]) => {
        const [ano, m, d] = dia.split('-');
        const dataFormatada = `${d}/${m}/${ano}`;
        return { dataFormatada, ...valores };
      });

    return {
      faturamentoHoje,
      gastosHoje,
      lucroHoje: faturamentoHoje - gastosHoje,
      faturamentoMes,
      gastosMes,
      lucroMes: faturamentoMes - gastosMes,
      historicoMeses,
      historicoDias
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

      <div className="bg-[#202024] p-5 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
          <CalendarDays className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-200">Histórico de Meses</h3>
        </div>
        <div className="space-y-3">
          {dadosAgrupados.historicoMeses.map((item, index) => (
            <div key={index} className="bg-[#121214] p-4 rounded border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-200">{item.nomeMes}</span>
                <span className={`font-mono font-bold ${item.lucro >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  Lucro: {formatCurrency(item.lucro)}
                </span>
              </div>
              <div className="flex justify-between space-x-4 text-xs">
                <span className="text-green-400">Receita: {formatCurrency(item.faturamento)}</span>
                <span className="text-red-400">Gastos: {formatCurrency(item.gastos)}</span>
              </div>
            </div>
          ))}
          {dadosAgrupados.historicoMeses.length === 0 && (
            <div className="text-gray-500 text-sm text-center py-4">Nenhum histórico disponível</div>
          )}
        </div>
      </div>

      <div className="bg-[#202024] p-5 rounded-lg border border-gray-800 pb-24">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
          <CalendarDays className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-200">Histórico de Dias</h3>
        </div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {dadosAgrupados.historicoDias.map((item, index) => (
            <div key={index} className="bg-[#121214] p-4 rounded border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-200">{item.dataFormatada}</span>
                <span className={`font-mono font-bold ${item.lucro >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  Lucro: {formatCurrency(item.lucro)}
                </span>
              </div>
              <div className="flex justify-between space-x-4 text-xs">
                <span className="text-green-400">Receita: {formatCurrency(item.faturamento)}</span>
                <span className="text-red-400">Gastos: {formatCurrency(item.gastos)}</span>
              </div>
            </div>
          ))}
          {dadosAgrupados.historicoDias.length === 0 && (
            <div className="text-gray-500 text-sm text-center py-4">Nenhum histórico disponível</div>
          )}
        </div>
      </div>
    </div>
  );
}
