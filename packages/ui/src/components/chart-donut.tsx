// a fatia do donut desenhada como ARCO com ponta redonda, e não como setor preenchido.
//
// o Recharts arredonda setor pelo cornerRadius, e ele trava em metade da espessura do anel
// (Sector.js, getPercentValue + Math.min). o efeito colateral é que fatia estreita não cabe
// no próprio arredondamento e sai com a ponta reta: num donut de seis locais de entrada, o
// que tem 2% virava um chip achatado no meio de cápsulas.
//
// aqui a fatia é um traço: um arco no meio do anel, com strokeWidth igual à espessura e
// strokeLinecap="round". a ponta redonda passa a ser desenho de linha, então ela é a mesma
// em fatia de 40% e em fatia de 2%. e como a ponta avança meia espessura pra fora de cada
// lado, uma fatia encosta na vizinha sozinha — é daí que vem a sobreposição.
//
// o vão entre elas não dá pra fazer só com paddingAngle: pra abrir folga de verdade seria
// preciso descontar o avanço das duas pontas, uns 24° por junção, e com seis fatias isso come
// mais de um terço do círculo. então cada fatia é desenhada duas vezes — primeiro um traço
// mais grosso na cor do card, depois o traço colorido por cima. como o Recharts pinta na
// ordem do data, o traço de fora de uma fatia recorta a vizinha que já estava lá, e o vão
// aparece sem tirar ângulo de ninguém.
//
// o preço: fatia minúscula nunca fica menor que a própria ponta redonda, então ela aparenta
// um tiquinho mais do que vale. ler "existe" é melhor do que sumir.
//
// a classe donut-capsula não é enfeite: o globals.css zera stroke de todo path dentro de
// .recharts-pie-sector, pra matar a borda branca que o Recharts põe por padrão. como aqui a
// fatia É o stroke, aquela regra apagava o anel inteiro. a exceção mora lá, casada com esta
// classe — mexeu numa, confere a outra.

import type * as React from "react";

const RADIANO = Math.PI / 180;

/** quanto o traço da cor do card avança de cada lado da fatia, em px. é a largura do vão */
const VAO = 3;

/** o Recharts mede ângulo em grau, anti-horário, com o zero às 3 horas | o y é invertido */
function pontoNoArco(cx: number, cy: number, raio: number, angulo: number) {
  return {
    x: cx + raio * Math.cos(-angulo * RADIANO),
    y: cy + raio * Math.sin(-angulo * RADIANO),
  };
}

interface FatiaProps {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  fillOpacity?: number | string;
  /** o markStroke marca a fatia clicada. contorno não cabe numa cápsula, então ela engorda */
  stroke?: string;
  filter?: string;
}

export function CapsulaDonut(props: FatiaProps): React.JSX.Element {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill,
    fillOpacity,
    stroke,
    filter,
  } = props;

  const raio = (innerRadius + outerRadius) / 2;
  const espessura = outerRadius - innerRadius + (stroke ? 4 : 0);
  const abertura = Math.abs(endAngle - startAngle);
  // o retorno tem que ser sempre um elemento: o tipo do shape do Recharts não aceita null
  if (raio <= 0 || espessura <= 0 || abertura <= 0) return <g />;

  // fatia única: o arco de 360° começa e termina no mesmo ponto e o path não fecha. círculo
  if (abertura >= 359.99) {
    return (
      <circle
        className="donut-capsula"
        cx={cx}
        cy={cy}
        r={raio}
        fill="none"
        stroke={fill}
        strokeOpacity={fillOpacity}
        strokeWidth={espessura}
        filter={filter}
      />
    );
  }

  const inicio = pontoNoArco(cx, cy, raio, startAngle);
  const fim = pontoNoArco(cx, cy, raio, endAngle);
  const arcoGrande = abertura > 180 ? 1 : 0;
  // no SVG o sweep 1 é o sentido horário da tela, que é o ângulo DIMINUINDO no Recharts
  const sentido = endAngle > startAngle ? 0 : 1;
  const traco = `M ${inicio.x} ${inicio.y} A ${raio} ${raio} 0 ${arcoGrande} ${sentido} ${fim.x} ${fim.y}`;

  return (
    <g filter={filter}>
      {/* o vão. fica sempre opaco, mesmo com a fatia esmaecida: são duas camadas, e se
			    esta também clareasse dava pra ver a vizinha através da junção */}
      <path
        className="donut-capsula"
        d={traco}
        fill="none"
        stroke="var(--card)"
        strokeWidth={espessura + VAO * 2}
        strokeLinecap="round"
      />
      <path
        className="donut-capsula"
        d={traco}
        fill="none"
        stroke={fill}
        strokeOpacity={fillOpacity}
        strokeWidth={espessura}
        strokeLinecap="round"
      />
    </g>
  );
}
