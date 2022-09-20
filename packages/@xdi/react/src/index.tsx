import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import type { Container, ResolutionOptions, Token } from 'xdi';

const XDIContext = createContext<XDIProviderProps | null>(null);

export interface XDIProviderProps {
  container: Container;
}

/**
 * Provides an XDI container as context for the `useService()` hook.
 */
export function XDIProvider(props: PropsWithChildren<XDIProviderProps>) {
  const { container, children } = props;

  const ctx = useMemo(() => {
    return { container };
  }, [container]);

  return <XDIContext.Provider value={ctx}>{children}</XDIContext.Provider>;
}

/**
 * Get a reference to a service instance from the nearest XDI container.
 */
export function useService<T>(token: Token<T>, options?: ResolutionOptions): T {
  const ctx = useContext(XDIContext);

  if (ctx == null) {
    throw new Error('[@xdi/react] Please wrap this React tree with `<XDIProvider>` before calling `useService(...)`.');
  }

  return useMemo(() => {
    return ctx.container.get(token, options);
  }, [token, options?.scope]);
}
