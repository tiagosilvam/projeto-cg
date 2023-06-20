import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

// Icon
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

type Props = {
  placeholder?: string;
  type?: string;
  step?: string;
  required?: boolean;
  error?: FieldError;
  onChange?: any;
};

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <div>
      <input
        className={`border ${
          props.error ? 'border-red-400 text-red-400' : 'border-gray-200'
        } text-sm rounded-lg hover:bg-gray-50 block w-full p-2.5 bg-transparent`}
        ref={ref}
        {...props}
      />
      <span className="text-red-400 text-xs ml-1 mt-1 flex items-center h-4 mb-1">
        {props.error && (
          <div className="flex flex-row">
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            {props.error.message}
          </div>
        )}
      </span>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
