import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, useStore } from "@/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

export const BookSearch = () => {
  const { books, addBook } = useStore((state) => state);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  type SearchResult = {
    docs: Book[];
    numFound: number;
  };

  const searchBooks = async (page: number = 1) => {
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`
      );
      setResults(response.data.docs);
      setTotalResults(response.data.numFound);
      setCurrentPage(page);
    } catch (error) {
      console.log("Error fetching OpenLibrary API data", error);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") searchBooks();
  };
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      searchBooks(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
      searchBooks(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults);

  return (
    <div className="-m-1.5 overflow-x-auto">
      <div className="sm:divide-y sm:divide-gray-200 sm:rounded-2xl sm:border sm:dark:divide-gray-700 sm:dark:border-gray-700">
        <div className="flex flex-col items-center gap-3 px-4 py-3 sm:flex-row">
          <div className="relative w-full sm:max-w-xs">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Søk etter din neste bok!"
            />
          </div>
          <Button
            className="max-sm:w-full sm:max-w-xs"
            onClick={() => searchBooks()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />{" "}
                Søker...{" "}
              </>
            ) : (
              "Søk"
            )}
          </Button>
        </div>

        <div className="mt-4 max-h-64 overflow-auto">
          {query.length > 0 && results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tittel</TableHead>
                  <TableHead>Forfatter</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Utgitt år
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Antall sider
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-y-auto">
                {results.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author_name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {book.first_publish_year}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {book.number_of_pages_median || "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() =>
                          addBook({
                            key: book.key,
                            title: book.title,
                            author_name: book.author_name,
                            first_publish_year: book.first_publish_year,
                            number_of_pages_median:
                              book.number_of_pages_median || null,
                            status: "backlog",
                          })
                        }
                        disabled={books.some((b) => b.key === book.key)}
                      >
                        Legg til
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex max-h-60 items-center justify-center p-16">
              <p className="text-gray-600 dark:text-gray-400">
                Sett i gang jakten på din neste bok!
              </p>
            </div>
          )}
        </div>
        <div className="flex w-full flex-col items-center gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-between dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalResults > 0 ? (
              <>
                Viser{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {" "}
                  {startIndex} - {endIndex}
                </span>{" "}
                av{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {totalResults}
                </span>{" "}
                resultater
              </>
            ) : (
              "0 resultater"
            )}
          </p>
          <div className="inline-flex gap-x-2">
            <Button
              variant="outline"
              onClick={handlePreviousClick}
              disabled={currentPage <= 1 || isLoading}
            >
              <SlArrowLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleNextClick}
              disabled={
                currentPage > Math.ceil(totalResults / resultsPerPage) ||
                isLoading
              }
            >
              <SlArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const SearchDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add a new book</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-xl">
          <DialogHeader>
            <DialogTitle>Add a new book</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add a new book</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add a new book</DrawerTitle>
          <DrawerDescription>Search for a book</DrawerDescription>
          {children}
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
