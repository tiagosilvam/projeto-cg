export function getMatrizTransform(transformacao: string, data: any) {
  const { x, y, z, fator, position, rotacao } = data[0];

  const radian = grausParaRadiano(rotacao);

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
          [0, Math.cos(radian), Math.sin(radian), 0],
          [0, -Math.sin(radian), Math.cos(radian), 0],
          [0, 0, 0, 1]
        ],
        y: [
          [Math.cos(radian), 0, -Math.sin(radian), 0],
          [0, 1, 0, 0],
          [Math.sin(radian), 0, Math.cos(radian), 0],
          [0, 0, 0, 1]
        ],
        z: [
          [Math.cos(radian), Math.sin(radian), 0, 0],
          [-Math.sin(radian), Math.cos(radian), 0, 0],
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

  return new Promise<number[][] | any>((resolve, reject) => {
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

// Convert graus para radiano
function grausParaRadiano(angulo: number) {
  return angulo * (3.14 / 180);
}

export function generateForm(
  forma: 'quadrado' | 'triangulo' | 'retangulo',
  size: number
) {
  const formas = {
    quadrado: {
      vertices: [
        [0, 0, 0, 1],
        [-size, 0, 0, 1],
        [-size, -size, 0, 1],
        [0, -size, 0, 1],
        [0, 0, -size, 1],
        [-size, 0, -size, 1],
        [-size, -size, -size, 1],
        [0, -size, -size, 1]
      ],
      lados: [
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
      ]
    },
    triangulo: {
      vertices: [
        [0, 0, 0, 1],
        [-size, 0, 0, 1],
        [0, -size, 0, 1],
        [0, 0, -size, 1]
      ],
      lados: [
        [0, 1],
        [1, 2],
        [2, 0],
        [0, 3],
        [1, 3],
        [2, 3]
      ]
    },
    retangulo: {
      vertices: [
        [0, 0, 0, 1],
        [-size * 1.5, 0, 0, 1],
        [-size * 1.5, -size, 0, 1],
        [0, -size, 0, 1],
        [0, 0, -size, 1],
        [-size * 1.5, 0, -size, 1],
        [-size * 1.5, -size, -size, 1],
        [0, -size, -size, 1]
      ],
      lados: [
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
      ]
    }
  };

  return formas[forma];
}
import p5Types from 'p5';
export const setPixel = (p5: p5Types, x: number, y: number, z: number) => {
  p5.stroke('orange');
  p5.strokeWeight(0.9);
  p5.point(x, y, z);
};

export function desenharRetaPMO(
  p5: p5Types,
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const dz = Math.abs(z2 - z1);
  const xs = x1 < x2 ? 1 : -1;
  const ys = y1 < y2 ? 1 : -1;
  const zs = z1 < z2 ? 1 : -1;

  let x = x1;
  let y = y1;
  let z = z1;

  const max = Math.max(dx, dy, dz);

  if (max === dx) {
    let yd = dy - dx / 2;
    let zd = dz - dx / 2;
    while (x !== x2) {
      setPixel(p5, x, y, z);
      if (yd >= 0) {
        y += ys;
        yd -= dx;
      }
      if (zd >= 0) {
        z += zs;
        zd -= dx;
      }
      x += xs;
      yd += dy;
      zd += dz;
    }
  } else if (max === dy) {
    let xd = dx - dy / 2;
    let zd = dz - dy / 2;
    while (y !== y2) {
      setPixel(p5, x, y, z);
      if (xd >= 0) {
        x += xs;
        xd -= dy;
      }
      if (zd >= 0) {
        z += zs;
        zd -= dy;
      }
      y += ys;
      xd += dx;
      zd += dz;
    }
  } else {
    let xd = dx - dz / 2;
    let yd = dy - dz / 2;
    while (z !== z2) {
      setPixel(p5, x, y, z);
      if (xd >= 0) {
        x += xs;
        xd -= dz;
      }
      if (yd >= 0) {
        y += ys;
        yd -= dz;
      }
      z += zs;
      xd += dx;
      yd += dy;
    }
  }
}

export function desenharRetaDDA(
  p5: p5Types,
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
) {
  // Diferenças entre os pontos inicial e final
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;

  // Verifica o maior valor absoluto entre dx, dy e dz
  const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));

  // Calcula os incrementos para cada eixo
  const xIncrement = dx / steps;
  const yIncrement = dy / steps;
  const zIncrement = dz / steps;

  // Coordenadas iniciais
  let x = x1;
  let y = y1;
  let z = z1;

  // Desenha cada ponto da reta
  for (let i = 0; i <= steps; i++) {
    // Desenhe o ponto (x, y, z)
    setPixel(p5, Math.round(x), Math.round(y), Math.round(z));

    // Atualiza as coordenadas para o próximo ponto
    x += xIncrement;
    y += yIncrement;
    z += zIncrement;
  }
}
