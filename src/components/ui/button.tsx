import type { ButtonHTMLAttributes } from 'react';
export function Button({className='',size,variant,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{size?:string;variant?:string}) {
  return <button {...props} className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium ${className}`} />;
}
