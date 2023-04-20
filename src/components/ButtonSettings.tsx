'use client';

import { Cog6ToothIcon } from '@heroicons/react/24/solid';

export const ButtonSettings = () => {
  const background = [
    '#000000',
    '#FFFFFF',
    '#00FF00',
    '#4d0950',
    '#8a0d1f',
    '#3f1053',
    '#0d31d7',
    '#6c5185',
    '#9089dd',
    '#1d3749',
    '#6a846e',
    '#017c82',
    '#653c67',
    '#b245b8',
    '#3b56e4',
    '#9b6473',
    '#621724',
    '#4b6079',
    '#771af1',
    '#a2573b',
    '#950e67',
    '#a8964b'
  ];

  const pixel = [
    '#000000',
    '#FFFFFF',
    '#e079e8',
    '#81c1f8',
    '#a7ca11',
    '#33ea37',
    '#e3ad36',
    '#dbea57',
    '#df45b8',
    '#f5c59e',
    '#b30b58'
  ];

  return (
    <div className="group text-white hover:text-blue-500">
      <div className="flex items-center">
        <Cog6ToothIcon className="w-6 h-6 group-hover:-rotate-90" />
        <span className="text-xs ml-1">Configurações</span>
      </div>
      <div className="bg-white rounded-md hidden group-hover:block absolute border shadow-sm p-4 w-56">
        <span className="text-xs text-zinc-500">Cor de Background</span>
        <div className="grid grid-cols-11 gap-1 mt-1">
          {background.map((color) => (
            <button
              className="w-4 h-4 border hover:border-blue-500"
              key={color}
              style={{ backgroundColor: `${color}` }}
              onClick={() => {
                localStorage.setItem('bg-canvas-color', `${color}`);
                document
                  .getElementById('canvas')
                  ?.style.setProperty('background-color', color);
              }}
            />
          ))}
        </div>
        <span className="text-xs text-zinc-500">Cor de Pixel</span>
        <div>
          <div className="grid grid-cols-11 gap-1 mt-1">
            {pixel.map((color) => (
              <button
                className="w-4 h-4 border hover:border-blue-500"
                key={color}
                style={{ backgroundColor: `${color}` }}
                onClick={() => localStorage.setItem('pixel-color', `${color}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
