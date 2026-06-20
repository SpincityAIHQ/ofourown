import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircle, X, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const STORAGE_KEY = "ofo_chat_threads_v1";
const ACTIVE_KEY = "ofo_chat_active_v1";

function newThread(): Thread {
  return {
    id: `thr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}

function loadThreads(): { threads: Thread[]; activeId: string } {
  if (typeof window === "undefined") {
    const t = newThread();
    return { threads: [t], activeId: t.id };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as Thread[]) : [];
    if (!Array.isArray(stored) || stored.length === 0) {
      const t = newThread();
      localStorage.setItem(STORAGE_KEY, JSON.stringify([t]));
      localStorage.setItem(ACTIVE_KEY, t.id);
      return { threads: [t], activeId: t.id };
    }
    const active = localStorage.getItem(ACTIVE_KEY) ?? stored[0].id;
    return { threads: stored, activeId: stored.some((s) => s.id === active) ? active : stored[0].id };
  } catch {
    const t = newThread();
    return { threads: [t], activeId: t.id };
  }
}

function titleFrom(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New conversation";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  return text.length > 40 ? `${text.slice(0, 40)}…` : text || "New conversation";
}

export function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const { threads: t, activeId: a } = loadThreads();
    setThreads(t);
    setActiveId(a);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads, mounted]);

  useEffect(() => {
    if (!mounted || !activeId) return;
    localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId, mounted]);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeId) ?? null,
    [threads, activeId],
  );

  function startNew() {
    const t = newThread();
    setThreads((prev) => [t, ...prev]);
    setActiveId(t.id);
    setShowList(false);
  }

  function selectThread(id: string) {
    setActiveId(id);
    setShowList(false);
  }

  function deleteThread(id: string) {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        const t = newThread();
        setActiveId(t.id);
        return [t];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  }

  function persistMessages(threadId: string, messages: UIMessage[]) {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages,
              updatedAt: Date.now(),
              title: t.title === "New conversation" ? titleFrom(messages) : t.title,
            }
          : t,
      ),
    );
  }

  if (!mounted) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition hover:scale-105 active:scale-95",
        )}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && activeThread ? (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(640px,calc(100vh-7rem))] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <header className="flex items-center justify-between gap-2 border-b border-border bg-background px-4 py-3">
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold leading-tight">Ask Ben Gordon</p>
              <p className="truncate text-xs text-muted-foreground">{activeThread.title}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowList((v) => !v)}
                aria-label="Conversations"
                title="Conversations"
              >
                <span className="text-xs font-medium">{threads.length}</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={startNew}
                aria-label="New conversation"
                title="New conversation"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {showList ? (
            <ThreadList
              threads={threads}
              activeId={activeId}
              onSelect={selectThread}
              onDelete={deleteThread}
              onClose={() => setShowList(false)}
            />
          ) : (
            <ChatPanel
              key={activeThread.id}
              thread={activeThread}
              onPersist={(msgs) => persistMessages(activeThread.id, msgs)}
            />
          )}
        </div>
      ) : null}
    </>
  );
}

function ThreadList({
  threads,
  activeId,
  onSelect,
  onDelete,
  onClose,
}: {
  threads: Thread[];
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const sorted = [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Conversations</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Done
        </button>
      </div>
      <ul>
        {sorted.map((t) => (
          <li
            key={t.id}
            className={cn(
              "flex items-center gap-2 border-b border-border px-4 py-3",
              t.id === activeId && "bg-accent/60",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(t.id)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-sm font-medium">{t.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {new Date(t.updatedAt).toLocaleString()}
              </p>
            </button>
            <button
              type="button"
              onClick={() => onDelete(t.id)}
              className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
              aria-label="Delete conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const transport = new DefaultChatTransport({ api: "/api/chat" });

function ChatPanel({
  thread,
  onPersist,
}: {
  thread: Thread;
  onPersist: (messages: UIMessage[]) => void;
}) {
  const { messages, sendMessage, status, error } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
    onError: (err) => {
      toast.error(err.message || "Chat failed. Try again.");
    },
  });

  const [text, setText] = useState("");

  // Persist messages whenever they change (after stream completes especially).
  const lastPersistRef = useRef<string>("");
  useEffect(() => {
    if (status === "submitted" || status === "streaming") return;
    const sig = JSON.stringify(messages);
    if (sig === lastPersistRef.current) return;
    lastPersistRef.current = sig;
    onPersist(messages);
  }, [messages, status, onPersist]);

  // Focus textarea on mount and after streams complete.
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (status === "ready") {
      formRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
    }
  }, [status, thread.id]);

  const isLoading = status === "submitted" || status === "streaming";

  async function handleSubmit() {
    const value = text.trim();
    if (!value || isLoading) return;
    setText("");
    await sendMessage({ text: value });
  }

  return (
    <>
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Ask Ben Gordon"
              description="Questions about training, wellness, coaching, or the shop — start here."
            />
          ) : (
            messages.map((message) => {
              const textPart = message.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              return (
                <Message from={message.role} key={message.id}>
                  {message.role === "assistant" ? (
                    <MessageResponse>{textPart}</MessageResponse>
                  ) : (
                    <MessageContent>{textPart}</MessageContent>
                  )}
                </Message>
              );
            })
          )}
          {status === "submitted" ? (
            <Message from="assistant">
              <Shimmer>Thinking…</Shimmer>
            </Message>
          ) : null}
          {error && !isLoading ? (
            <p className="px-2 text-xs text-destructive">{error.message}</p>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        ref={formRef}
        onSubmit={async (_msg, event) => {
          event.preventDefault();
          await handleSubmit();
        }}
        className="border-t border-border bg-background"
      >
        <PromptInputTextarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about training, wellness, coaching…"
        />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit status={status} disabled={!text.trim() || isLoading} />
        </PromptInputFooter>
      </PromptInput>
    </>
  );
}