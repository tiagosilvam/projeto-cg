interface Props {
  name: string;
  type?: 'button' | 'submit';
  icon?: JSX.Element;
  onClick?: () => void;
  color: string;
  hover: string;
}

export function Button({ name, type, icon, onClick, color, hover }: Props) {
  return (
    <button
      className={`${color} ${hover} rounded text-white h-10 px-5 py-2.5 text-center inline-flex items-center justify-center`}
      type={type}
      onClick={onClick}
    >
      {icon}
      {name}
    </button>
  );
}
