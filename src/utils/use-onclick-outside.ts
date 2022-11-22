import { useEffect } from 'react';

export const useOnClickOutside = (ref: React.MutableRefObject<HTMLElement>, callback: Function): void => {
  const clickHandler = (event: Event): void => {
    if (ref.current && !ref.current.contains(event.target as Element)) {
      callback();
    }
  };

  useEffect((): (() => void) => {
    document.addEventListener('click', clickHandler);
    return (): void => document.removeEventListener('click', clickHandler);
  }, []);
};
