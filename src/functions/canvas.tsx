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

export function desenharCubo(ctx: CanvasRenderingContext2D) {
  // Configurações do cubo
  const cubeSize = 50;
  const cubeVertices = [
    [-cubeSize, -cubeSize, -cubeSize],
    [cubeSize, -cubeSize, -cubeSize],
    [cubeSize, cubeSize, -cubeSize],
    [-cubeSize, cubeSize, -cubeSize],
    [-cubeSize, -cubeSize, cubeSize],
    [cubeSize, -cubeSize, cubeSize],
    [cubeSize, cubeSize, cubeSize],
    [-cubeSize, cubeSize, cubeSize]
  ];
  const cubeEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
  ];

  // Função de projeção
  function project(vertex: number[]) {
    const x = vertex[0];
    const y = vertex[1];
    const z = vertex[2];
    const factor = 500 / (500 + z);
    const projectedX = x * factor + 800 / 2;
    const projectedY = y * factor + 600 / 2;
    return [projectedX, projectedY];
  }

  // Função de desenho do cubo
  function drawCube() {
    // original
    // Limpar o Canvas
    ctx.clearRect(0, 0, 800, 600);

    // Desenhar as arestas do cubo
    ctx.beginPath();
    for (let i = 0; i < cubeEdges.length; i++) {
      const vertex1 = cubeVertices[cubeEdges[i][0]];
      const vertex2 = cubeVertices[cubeEdges[i][1]];
      const projectedVertex1 = project(vertex1);
      const projectedVertex2 = project(vertex2);
      ctx.moveTo(projectedVertex1[0], projectedVertex1[1]);
      ctx.lineTo(projectedVertex2[0], projectedVertex2[1]);
    }
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }
  // Animação do cubo
  function rotateX() {
    // Atualizar a posição e orientação do cubo
    const angleX = -0.05;

    // Rotacionar os vértices do cubo em torno do eixo X
    for (let i = 0; i < cubeVertices.length; i++) {
      const vertex = cubeVertices[i];
      const x = vertex[0];
      const y = vertex[1];
      const z = vertex[2];

      // Rotação em torno do eixo Y
      const newY = y * Math.cos(angleX) + z * Math.sin(angleX);
      const newZ = z * Math.cos(angleX) - y * Math.sin(angleX);
      vertex[0] = x;
      vertex[1] = newY;
      vertex[2] = newZ;
    }
    // Desenhar o cubo
    drawCube();
  }

  function rotateY() {
    // Atualizar a posição e orientação do cubo
    const angleY = 0.05;

    // Rotacionar os vértices do cubo em torno do eixo Y
    for (let i = 0; i < cubeVertices.length; i++) {
      const vertex = cubeVertices[i];
      const x = vertex[0];
      const y = vertex[1];
      const z = vertex[2];

      // Rotação em torno do eixo Y
      const newX = x * Math.cos(angleY) - z * Math.sin(angleY);
      const newZ = z * Math.cos(angleY) + x * Math.sin(angleY);
      vertex[0] = newX;
      vertex[1] = y;
      vertex[2] = newZ;
    }
    // Desenhar o cubo
    drawCube();
  }

  function rotateZ() {
    // Atualizar a posição e orientação do cubo
    const angleZ = 0.05;

    // Rotacionar os vértices do cubo em torno do eixo Z
    for (let i = 0; i < cubeVertices.length; i++) {
      const vertex = cubeVertices[i];
      const x = vertex[0];
      const y = vertex[1];
      const z = vertex[2];

      // Rotação em torno do eixo Z
      const newX = x * Math.cos(angleZ) - y * Math.sin(angleZ);
      const newY = y * Math.cos(angleZ) + x * Math.sin(angleZ);
      vertex[0] = newX;
      vertex[1] = newY;
      vertex[2] = z;
    }
    // Desenhar o cubo
    drawCube();
  }
  drawCube();
}
