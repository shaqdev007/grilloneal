export interface Produto {
  nome: string;
  preco: number;
}

export interface ItemComanda extends Produto {
  id: string;
}

export interface Comanda {
  id: string;
  nome: string;
  itens: ItemComanda[];
}

export type MetodoPagamento = 'Dinheiro' | 'Pix' | 'Cartão';

export type CaixaMetodos = Record<MetodoPagamento, number>;

export interface Gasto {
  id: string;
  descricao: string;
  valor: number;
  data: string;
}

export interface ProdutoCardapio extends Produto {
  id: string;
}

export interface Rendimento {
  id: string;
  valor: number;
  data: string;
  metodo: MetodoPagamento;
}

export type TelaAtiva = 'comandas' | 'gastos' | 'caixa' | 'cardapio' | 'faturamento';
