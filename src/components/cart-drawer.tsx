import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, formatPrice } from "@/lib/cart";
import { createCartCheckoutSession } from "@/lib/checkout.functions";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const { count, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart (${count} item${count === 1 ? "" : "s"})`}
      className="relative inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, remove, subtotalCents, currency, count } =
    useCart();
  const checkout = useServerFn(createCartCheckoutSession);
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!items.length) return;
    setLoading(true);
    try {
      const { url } = await checkout({
        data: { items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })) },
      });
      if (url) window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start checkout.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-semibold">
            Cart {count > 0 ? `(${count})` : ""}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-4 p-6">
                  <div className="h-20 w-20 shrink-0 border border-border bg-muted">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{item.name}</p>
                      <button
                        onClick={() => remove(item.slug)}
                        aria-label={`Remove ${item.name}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.price_cents, item.currency)}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <button
                        onClick={() => setQuantity(item.slug, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="inline-flex h-7 w-7 items-center justify-center border border-border hover:bg-accent"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.slug, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="inline-flex h-7 w-7 items-center justify-center border border-border hover:bg-accent"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-border px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotalCents, currency)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Taxes and shipping calculated at checkout.
            </p>
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-4 h-12 w-full rounded-none uppercase tracking-wider"
            >
              {loading ? "Starting checkout..." : "Checkout"}
            </Button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}