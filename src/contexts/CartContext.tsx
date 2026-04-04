"use client";

import * as React from "react";

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartValue = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  total: number;
  count: number;
  ready: boolean;
};

const KEY = "htm.breakfast.cart.v1";

const CartContext = React.createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = React.useCallback(
    (line: Omit<CartLine, "quantity"> & { quantity?: number }) => {
      const q = line.quantity ?? 1;
      setLines((prev) => {
        const i = prev.findIndex((x) => x.productId === line.productId);
        if (i === -1) return [...prev, { ...line, quantity: q }];
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + q };
        return next;
      });
    },
    [],
  );

  const setQty = React.useCallback((productId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((x) => x.productId !== productId);
      return prev.map((x) =>
        x.productId === productId ? { ...x, quantity } : x,
      );
    });
  }, []);

  const remove = React.useCallback((productId: string) => {
    setLines((prev) => prev.filter((x) => x.productId !== productId));
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const total = React.useMemo(
    () => lines.reduce((s, l) => s + l.price * l.quantity, 0),
    [lines],
  );

  const count = React.useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  );

  const value = React.useMemo(
    () => ({ lines, add, setQty, remove, clear, total, count, ready }),
    [lines, add, setQty, remove, clear, total, count, ready],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const v = React.useContext(CartContext);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
