import { useStore, Book } from "@/store";

import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DragDropContext,
  Draggable,
  DropResult,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StricktModeDroppable";
import { ReactElement, JSXElementConstructor } from "react";

export const BookList = () => {
  const { books, removeBook, moveBook, reorderBooks } = useStore(
    (state) => state
  );
  const moveToList = (book: Book, targetList: Book["status"]) => {
    moveBook(book, targetList);
  };
  const renderBookItem = (
    book: Book,
    index: number,
    listType: Book["status"]
  ) => (
    <Card key={index}>
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>{book.author_name}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={() => removeBook(book)}>
          Remove
        </Button>
        <div className="inline-flex gap-2">
          <Button
            variant="outline"
            onClick={() => moveToList(book, "inProgress")}
            disabled={listType === "inProgress"}
          >
            In progress
          </Button>
          <Button
            variant="outline"
            onClick={() => moveToList(book, "backlog")}
            disabled={listType === "backlog"}
          >
            Backlog
          </Button>
          <Button
            variant="outline"
            onClick={() => moveToList(book, "done")}
            disabled={listType === "done"}
          >
            Done
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const listType = result.source.droppableId as Book["status"];

    reorderBooks(listType, sourceIndex, destinationIndex);
  };

  const renderDraggableBookList = (listType: Book["status"]) => {
    const filteredBooks = books.filter((book) => book.status === listType);

    return (
      <StrictModeDroppable droppableId={listType}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {filteredBooks.map((book, index) => (
              <Draggable key={book.key} draggableId={book.key} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="my-2"
                  >
                    <div {...provided.dragHandleProps}>
                      {renderBookItem(book, index, listType)}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    );
  };

  return (
    <div className="space-y-8 p-4">
      <h2 className="mb-4 text-2xl font-bold">Leseliste</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        {books.filter((book) => book.status === "inProgress").length > 0 && (
          <>
            <h3 className="mb-2 text-xl font-semibold">In Progress</h3>
            {renderDraggableBookList("inProgress")}
          </>
        )}
      </DragDropContext>
      <DragDropContext onDragEnd={onDragEnd}>
        {books.filter((book) => book.status === "backlog").length > 0 && (
          <>
            <h3 className="mb-2 text-xl font-semibold">Backlog</h3>
            {renderDraggableBookList("backlog")}
          </>
        )}
      </DragDropContext>
      {books.filter((book) => book.status === "done").length > 0 && (
        <>
          <h3 className="mb-2 text-xl font-semibold">Done</h3>
          <div>
            {books
              .filter((book) => book.status === "done")
              .map((book, index) => renderBookItem(book, index, "done"))}
          </div>
        </>
      )}
    </div>
  );
};
