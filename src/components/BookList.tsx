import { Book } from "./BookSearch";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const BookList = ({
  books,
  onMoveBook,
  onRemoveBook,
}: {
  books: Book[];
  onMoveBook: (book: Book, targetList: Book["status"]) => void;
  onRemoveBook: (book: Book) => void;
}) => {
  const moveToList = (book: Book, targetList: Book["status"]) => {
    onMoveBook(book, targetList);
  };
  const renderBookItem = (book: Book, index: number, listType: string) => (
    <Card key={index}>
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>{book.author_name}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={() => onRemoveBook(book)}>
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
  return (
    <div className="space-y-8 p-4">
      <h2 className="mb-4 text-2xl font-bold">Leseliste</h2>
      {books.filter((book) => book.status === "inProgress").length > 0 && (
        <>
          <h3 className="mb-2 text-xl font-semibold">In Progress</h3>
          <div>
            {books
              .filter((book) => book.status === "inProgress")
              .map((book, index) => renderBookItem(book, index, "inProgress"))}
          </div>
        </>
      )}
      {books.filter((book) => book.status === "backlog").length > 0 && (
        <>
          <h3 className="mb-2 text-xl font-semibold">Backlog</h3>
          <div>
            {books
              .filter((book) => book.status === "backlog")
              .map((book, index) => renderBookItem(book, index, "backlog"))}
          </div>
        </>
      )}
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