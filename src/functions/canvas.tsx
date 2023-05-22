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

// Reta
export function desenharRetaPM(
  ctx: CanvasRenderingContext2D,
  posX: number,
  posY: number,
  posX2: number,
  posY2: number
) {
  const pontos = [];

  // Iterators, counters required by algorithm
  let x, y, px, py, xEnd, yEnd; // Calculate line deltas
  const dx = posX2 - posX;
  const dy = posY2 - posY; // Create a positive copy of deltas (makes iterating easier)
  px = 2 * Math.abs(dy) - Math.abs(dx);
  py = 2 * Math.abs(dx) - Math.abs(dy); // The line is X-axis dominant
  if (Math.abs(dy) <= Math.abs(dx)) {
    // Line is drawn left to right
    if (dx >= 0) {
      x = posX;
      y = posY;
      xEnd = posX2;
    } else {
      // Line is drawn right to left (swap ends)
      x = posX2;
      y = posY2;
      xEnd = posX;
    }
    setPixel(ctx, x, y); // Draw first pixel        // Rasterize the line
    pontos.push([x, y]);
    while (x < xEnd) {
      x++;
      if (px < 0) {
        px += 2 * Math.abs(dy);
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          y++;
        } else {
          y--;
        }
        px = px + 2 * (Math.abs(dy) - Math.abs(dx));
      } // Draw pixel from line span at
      // currently rasterized position
      setPixel(ctx, x, y);
      pontos.push([x, y]);
    }
  } else {
    // The line is Y-axis dominant        // Line is drawn bottom to top
    if (dy >= 0) {
      x = posX;
      y = posY;
      yEnd = posY2;
    } else {
      // Line is drawn top to bottom
      x = posX2;
      y = posY2;
      yEnd = posY;
    }
    setPixel(ctx, x, y); // Draw first pixel        // Rasterize the line
    pontos.push([x, y]);
    while (y < yEnd) {
      y++;
      if (py <= 0) {
        py += 2 * Math.abs(dx);
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          x++;
        } else {
          x--;
        }
        py = py + 2 * (Math.abs(dx) - Math.abs(dy));
      } // Draw pixel from line span at
      // currently rasterized position
      setPixel(ctx, x, y);
      pontos.push([x, y]);
    }
  }
  return pontos;
}

export function desenharRetaDDA(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  xEnd: number,
  yEnd: number
) {
  const pontos = [];

  const dx = xEnd - x0;
  const dy = yEnd - y0;
  let steps, k;

  let x = x0;
  let y = y0;

  if (Math.abs(dx) > Math.abs(dy)) {
    steps = Math.abs(dx);
  } else {
    steps = Math.abs(dy);
  }
  const xIncrement = dx / steps;
  const yIncrement = dy / steps;
  setPixel(ctx, Math.round(x), Math.round(y));
  pontos.push([x, y]);
  for (k = 0; k < steps; k++) {
    x += xIncrement;
    y += yIncrement;
    setPixel(ctx, Math.round(x), Math.round(y));
    pontos.push([x, y]);
  }
  return pontos;
}
// Fim Algoritmos Reta

// Algoritmos Círculo
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

export function getMatrizTransform(transformacao: string, data: any) {
  const { x, y, z, fator, position, rotacao } = data.data[0];

  console.log(x, y, z, fator, position, rotacao);
  const matrizesTransformacao = {
    translacao: {
      matriz: [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [-x, -y, -z, 1]
      ]
    },
    escala: {
      matriz: [
        [fator, 0, 0, 0],
        [0, fator, 0, 0],
        [0, 0, fator, 0],
        [0, 0, 0, 1]
      ]
    },
    rotacao: {
      matriz: {
        x: [
          [1, 0, 0, 0],
          [0, Math.cos(rotacao), -Math.sin(rotacao), 0],
          [0, Math.sin(rotacao), Math.cos(rotacao), 0],
          [0, 0, 0, 1]
        ],
        y: [
          [Math.cos(rotacao), 0, Math.sin(rotacao), 0],
          [0, 1, 0, 0],
          [-Math.sin(rotacao), 0, Math.cos(rotacao), 0],
          [0, 0, 0, 1]
        ],
        z: [
          [Math.cos(rotacao), -Math.sin(rotacao), 0, 0],
          [Math.sin(rotacao), Math.cos(rotacao), 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ]
      }
    },
    cisalhamento: {
      matriz: {
        x: [
          [1, y, z, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ],
        y: [
          [1, 0, 0, 0],
          [x, 1, z, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ],
        z: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [x, y, 1, 0],
          [0, 0, 0, 1]
        ]
      }
    },
    reflexao: {
      matriz: {
        x: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, -1, 0],
          [0, 0, 0, 0]
        ],
        y: [
          [-1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 0]
        ],
        z: [
          [1, 0, 0, 0],
          [0, -1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 0]
        ]
      }
    }
  };

  return new Promise((resolve, reject) => {
    Object.entries(matrizesTransformacao).find(([key, value]) => {
      if (transformacao === key) {
        if (Object.hasOwn(value.matriz, position)) {
          resolve(value.matriz[position]);
        } else {
          resolve(value.matriz);
        }
      }
    });
    reject('Não foi possível gerar a matriz.');
  });
}
