export function setPixel(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const color = localStorage.getItem('pixel-color');

  // Calcula centro da tela
  const centerX = 800 / 2;
  const centerY = 600 / 2;

  // Colocar pixels
  ctx.fillStyle = `${color ? color : 'red'}`;
  ctx.fillRect(x + centerX, centerY - y, 1, 1);
}

export function setLines(ctx: CanvasRenderingContext2D) {
  // Traça os quadrantes
  ctx.strokeStyle = 'rgba(255,255,255, 0.3)';
  ctx.moveTo(0, 300);
  ctx.lineTo(399, 300);
  ctx.moveTo(400, 0);
  ctx.lineTo(400, 600);
  ctx.moveTo(401, 300);
  ctx.lineTo(800, 300);
  ctx.stroke();
}

export function clear(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, 800, 600);
  ctx.beginPath();
}

export function desenharCubo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  // Defina os vértices do cubo
  const cubo = {
    vertices: [
      [x, y],
      [x + size, y],
      [x + size, y + size],
      [x, y + size]
    ],
    lados: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0] // Arestas do cubo
    ]
  };

  // Desenhe as linhas que conectam os vértices do cubo
  for (let i = 0; i < cubo.lados.length; i++) {
    const ponto1 = cubo.vertices[cubo.lados[i][0]];
    const ponto2 = cubo.vertices[cubo.lados[i][1]];
    desenharRetaPM(ctx, ponto1[0], ponto1[1], ponto2[0], ponto2[1]);
  }

  return cubo;
}

export function desenharRetangulo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  // Defina os vértices do cubo
  const cubo = {
    vertices: [
      [x, y],
      [x + size * 1.5, y],
      [x + size * 1.5, y + size],
      [x, y + size]
    ],
    lados: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0] // Arestas do cubo
    ]
  };

  // Desenhe as linhas que conectam os vértices do cubo
  for (let i = 0; i < cubo.lados.length; i++) {
    const ponto1 = cubo.vertices[cubo.lados[i][0]];
    const ponto2 = cubo.vertices[cubo.lados[i][1]];
    desenharRetaPM(ctx, ponto1[0], ponto1[1], ponto2[0], ponto2[1]);
  }
  return cubo;
}

// Reta algorítmo PM
export function desenharRetaPM(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const xs = x1 < x2 ? 1 : -1;
  const ys = y1 < y2 ? 1 : -1;

  let x = x1;
  let y = y1;

  const points = [];

  if (dx >= dy) {
    const dy2 = dy * 2;
    const dy2dx2 = (dy - dx) * 2;
    let p = dy2 - dx;

    while (x !== x2) {
      setPixel(ctx, x, y);
      points.push([x, y]);

      if (p > 0) {
        y += ys;
        p += dy2dx2;
      } else {
        p += dy2;
      }

      x += xs;
    }
  } else {
    const dx2 = dx * 2;
    const dx2dy2 = (dx - dy) * 2;
    let p = dx2 - dy;

    while (y !== y2) {
      setPixel(ctx, x, y);
      points.push([x, y]);

      if (p > 0) {
        x += xs;
        p += dx2dy2;
      } else {
        p += dx2;
      }

      y += ys;
    }
  }

  return points;
}

// Reta algorítmo DDA
export function desenharRetaDDA(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  const xIncrement = dx / steps;
  const yIncrement = dy / steps;

  let x = x1;
  let y = y1;

  const points = [];

  for (let i = 0; i <= steps; i++) {
    points.push([Math.round(x), Math.round(y)]);
    setPixel(ctx, Math.round(x), Math.round(y));

    x += xIncrement;
    y += yIncrement;
  }

  return points;
}

// Algoritmo Círculo PM
export function desenharPontoMedioCirculo(
  ctx: CanvasRenderingContext2D,
  r: number
) {
  const pontos = [];

  let y = r;
  let d;
  if (y % 2 === 0) {
    d = 1 - r;
  } else {
    d = 5 / 4 - r;
  }
  let x = 0;
  pontoCirculo(ctx, x, y);
  pontos.push([x, y]);
  while (y > x) {
    if (d < 0) {
      d += 2.0 * x + 3.0;
    } else {
      d += 2.0 * (x - y) + 5;
      y--;
    }
    x++;
    pontoCirculo(ctx, x, y);
  }
  return pontos;
}

function pontoCirculo(ctx: CanvasRenderingContext2D, x: number, y: number) {
  setPixel(ctx, x, y);
  setPixel(ctx, y, x);
  setPixel(ctx, y, -x);
  setPixel(ctx, x, -y);
  setPixel(ctx, -x, -y);
  setPixel(ctx, -y, -x);
  setPixel(ctx, -y, x);
  setPixel(ctx, -x, y);
}

// tamanho da tela
const LARGURA = 1920;
const ALTURA = 1080;

// intervalo de entrada
const INTERVALO_X_INPUT = [-(LARGURA / 2), LARGURA / 2];
const INTERVALO_Y_INPUT = [-(ALTURA / 2), ALTURA / 2];

// intervalo NDC: [-1, 1] para X e Y
const INTERVALO_X_NDC = [-1, 1];
const INTERVALO_Y_NDC = [-1, 1];

const INTERVALO_X_USER = [0, 50];
const INTERVALO_Y_USER = [0, 50];

function to_ndc(ponto: number[], intervalo_x: number[], intervalo_y: number[]) {
  const [x, y] = ponto;
  const [xmin, xmax] = intervalo_x;
  const [ymin, ymax] = intervalo_y;
  const [ndcxmin, ndcxmax] = INTERVALO_X_NDC;
  const [ndcymin, ndcymax] = INTERVALO_Y_NDC;

  // fórmula completa para calcular o NDC
  const ndcx = ((x - xmin) * (ndcxmax - ndcxmin)) / (xmax - xmin) + ndcxmin;
  const ndcy = ((y - ymin) * (ndcymax - ndcymin)) / (ymax - ymin) + ndcymin;

  return [ndcx, ndcy];
}

export function inp_to_ndc(ponto: number[]) {
  return to_ndc(ponto, INTERVALO_X_INPUT, INTERVALO_Y_INPUT);
}

export function ndc_to_user(ponto: number[]) {
  const [x, y] = ponto;
  const x2 = user_to_ndc(x, y);
  return to_coordinates(x2, INTERVALO_X_USER, INTERVALO_Y_USER);
}

function to_coordinates(
  ponto: number[],
  intervalo_x: number[],
  intervalo_y: number[]
) {
  const [ndcx, ndcy] = ponto;
  const [xmin, xmax] = intervalo_x;
  const [ymin, ymax] = intervalo_y;
  const [ndh, ndv] = [xmax - xmin, ymax - ymin];

  const dcx = Math.round(ndcx * (ndh - 1));
  const dcy = Math.round(ndcy * (ndv - 1));

  return [dcx, dcy];
}

export function ndc_to_dc(userX: number, userY: number) {
  // Calculando NDCX e NDCY para usar em sequência
  const [NDCX, NDCY] = user_to_ndc(userX, userY);

  // Calculando DCX e DCY
  const DCX = Math.round(NDCX * (LARGURA - 1));
  const DCY = Math.round(NDCY * (LARGURA - 1));

  return [DCX, DCY];
}

export function user_to_ndc(userX: number, userY: number) {
  // Definindo Máximos e Mínimos
  const [minX, maxX] = INTERVALO_X_USER;
  const [minY, maxY] = INTERVALO_Y_USER;

  // Calcula a variação de largura e altura da caixa delimitadora em coordenadas de usuário
  const userWidth = maxX - minX;
  const userHeight = maxY - minY;

  // Converte as coordenadas de usuário para NDC
  const ndcX = (userX - minX) / userWidth;
  const ndcY = (userY - minY) / userHeight;

  return [ndcX, ndcY];
}
