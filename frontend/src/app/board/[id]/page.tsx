"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ArrowLeft } from "lucide-react";
import { BoardHeader } from "@/components/boards/BoardHeader";
import { KanbanCard } from "@/components/boards/KanbanCard";
import { KanbanColumn } from "@/components/boards/KanbanColumn";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { getBoardById, kanbanCards, statusColumns, teamMembers, type KanbanCardData, type KanbanPriority, type KanbanStatus } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: PageProps) {
  const { id } = use(params);
  const boardId = Number(id);
  const board = getBoardById(boardId);
  const [cards, setCards] = useState<KanbanCardData[]>(kanbanCards.filter((card) => card.boardId === board.id));
  const [selectedCard, setSelectedCard] = useState<KanbanCardData | null>(null);
  const [draftStatus, setDraftStatus] = useState<KanbanStatus>("todo");
  const [composerOpen, setComposerOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<KanbanCardData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const cardsByStatus = useMemo(
    () =>
      statusColumns.reduce(
        (acc, column) => {
          acc[column.id] = cards.filter((card) => card.status === column.id);
          return acc;
        },
        {} as Record<KanbanStatus, KanbanCardData[]>
      ),
    [cards]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const draggedCard = cards.find((card) => card.id === activeId);

    if (!draggedCard) return;

    const overCard = cards.find((card) => card.id === overId);
    const targetStatus = (overCard?.status ?? overId) as KanbanStatus;

    if (!targetStatus) return;

    const currentCards = cards.filter((card) => card.status === targetStatus);
    const oldIndex = cards.findIndex((card) => card.id === activeId);
    const targetCards = currentCards.filter((card) => card.id !== activeId);
    const newIndex = overCard ? targetCards.findIndex((card) => card.id === overCard.id) : targetCards.length;

    let nextCards = cards.map((card) => (card.id === activeId ? { ...card, status: targetStatus } : card));

    if (draggedCard.status === targetStatus && overCard) {
      const scopedCards = nextCards.filter((card) => card.status === targetStatus);
      const reordered = arrayMove(
        scopedCards,
        scopedCards.findIndex((card) => card.id === activeId),
        scopedCards.findIndex((card) => card.id === overCard.id)
      );
      nextCards = nextCards.filter((card) => card.status !== targetStatus).concat(reordered);
    } else if (draggedCard.status !== targetStatus) {
      const updatedCard = { ...draggedCard, status: targetStatus };
      const withoutActive = nextCards.filter((card) => card.id !== activeId);
      const insertionBase = withoutActive.filter((card) => card.status !== targetStatus);
      const targetGroup = withoutActive.filter((card) => card.status === targetStatus);
      targetGroup.splice(Math.max(newIndex, 0), 0, updatedCard);
      nextCards = [...insertionBase, ...targetGroup];
    }

    if (oldIndex >= 0) {
      setCards(nextCards);
    }
  };

  const handleSaveCard = (formData: FormData) => {
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const status = String(formData.get("status") || draftStatus) as KanbanStatus;
    const priority = String(formData.get("priority") || "medium") as KanbanPriority;

    if (!title) return;

    if (selectedCard) {
      setCards((current) =>
        current.map((card) =>
          card.id === selectedCard.id
            ? { ...card, title, tag: description || card.tag, status, priority }
            : card
        )
      );
    } else {
      setCards((current) => [
        {
          id: `k-${Date.now()}`,
          boardId: board.id,
          title,
          tag: description || "Planning",
          status,
          priority,
          dueDate: new Date().toISOString(),
          comments: 0,
          assignee: teamMembers[0],
        },
        ...current,
      ]);
    }

    setComposerOpen(false);
    setSelectedCard(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to recent
          </Link>
          <Button
            className="rounded-full"
            onClick={() => {
              setSelectedCard(null);
              setDraftStatus("todo");
              setComposerOpen(true);
            }}
          >
            Add task
          </Button>
        </div>

        <BoardHeader board={board} members={board.members} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => {
            const card = cards.find((item) => item.id === event.active.id);
            setActiveCard(card ?? null);
          }}
          onDragEnd={handleDragEnd}
        >
          <div className="editorial-scroll flex gap-4 overflow-x-auto pb-4">
            {statusColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.label}
                cards={cardsByStatus[column.id]}
                onAddCard={(status) => {
                  setDraftStatus(status);
                  setSelectedCard(null);
                  setComposerOpen(true);
                }}
                onOpenCard={(card) => {
                  setSelectedCard(card);
                  setDraftStatus(card.status);
                  setComposerOpen(true);
                }}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? <KanbanCard card={activeCard} onClick={() => undefined} dragging /> : null}
          </DragOverlay>
        </DndContext>

        <Dialog
          open={composerOpen}
          onClose={() => {
            setComposerOpen(false);
            setSelectedCard(null);
          }}
          title={selectedCard ? "Edit card" : "Create card"}
          description="Refine the current board without leaving flow."
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setComposerOpen(false);
                  setSelectedCard(null);
                }}
              >
                Cancel
              </Button>
              <Button form="card-composer" type="submit">
                {selectedCard ? "Save changes" : "Create card"}
              </Button>
            </>
          }
        >
          <form id="card-composer" action={handleSaveCard} className="space-y-4">
            <Field label="Title" required>
              <Input name="title" defaultValue={selectedCard?.title ?? ""} placeholder="Polish launch notes" />
            </Field>
            <Field label="Context">
              <Textarea
                name="description"
                defaultValue={selectedCard?.tag ?? ""}
                placeholder="Write a short context or label for this card..."
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <Select name="status" defaultValue={selectedCard?.status ?? draftStatus}>
                  {statusColumns.map((column) => (
                    <option key={column.id} value={column.id}>
                      {column.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Priority">
                <Select name="priority" defaultValue={selectedCard?.priority ?? "medium"}>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </Field>
            </div>
          </form>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}