interface Props {
  label: string;
  name: string;
  defaultChecked?: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export function RadioButton({ name, label, onClick, defaultChecked }: Props) {
  return (
    <div className="flex items-center">
      <input
        name={name}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        type="radio"
        onClick={onClick}
        defaultChecked={defaultChecked}
      />
      <label className="ml-2 text-sm font-medium">{label}</label>
    </div>
  );
}
