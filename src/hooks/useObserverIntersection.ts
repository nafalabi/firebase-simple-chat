import { RefObject, useEffect, useState } from "react";

const useObserverIntersection = (
  root: RefObject<HTMLElement> | null,
  target: RefObject<HTMLElement>,
  option: {
    rootMargin: IntersectionObserverInit['rootMargin'],
    threshold: IntersectionObserverInit['threshold']
  } | null,
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const callback = ([{ isIntersecting: _isIntersecting }]: IntersectionObserverEntry[]) => {
      setIsIntersecting(_isIntersecting);
    };

    const observer = new IntersectionObserver(callback, {
      root: root?.current,
      rootMargin: option?.rootMargin ?? '0px',
      threshold: option?.threshold ?? 1.0,
    })

    observer.observe(target.current!);

    return () => observer.disconnect();
  }, []);

  return isIntersecting;
};

export default useObserverIntersection;

