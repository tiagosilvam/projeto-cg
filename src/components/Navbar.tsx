import ButtonSettings from '@/components/ButtonSettings';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-4">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          className="fill-current h-8 w-8 mr-4"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <Link href="/" className="font-semibold text-xl tracking-tight">
          Projeto Computação Gráfica
        </Link>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <Link
            className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-blue-500 mr-4"
            href="/"
          >
            Home
          </Link>
          <Link
            className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-blue-500 mr-4"
            href="/pixel"
          >
            Pixel
          </Link>
          <span className="group block mt-4 lg:inline-block lg:mt-0 text-white hover:text-blue-500 mr-4 cursor-pointer">
            2D
            <div className="hidden group-hover:block absolute bg-white border rounded shadow-sm text-gray-900 py-2 w-32">
              <ul className="flex flex-col">
                <Link href="/2d/reta">
                  <li className="hover:bg-zinc-100 px-4 py-2">Reta</li>
                </Link>
                <Link href="/2d/circulo">
                  <li className="hover:bg-zinc-100 px-4 p-2">Círculo</li>
                </Link>
              </ul>
            </div>
          </span>
          <Link
            className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-blue-500 mr-4"
            href="/3d/test"
          >
            3D
          </Link>
          <div className="absolute top-5 lg:inline-block">
            <ButtonSettings />
          </div>
        </div>
      </div>
    </nav>
  );
}
