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

export type Book = {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year: string;
  number_of_pages_median: string | null;
  status: "done" | "inProgress" | "backlog";
};
export const BookSearch = ({
  onAddBook,
}: {
  onAddBook: (book: Book) => void;
}) => {
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
    <div className="p-4">
      <div className="sm:max-w-xs">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="Søk etter din neste bok!"
        />
      </div>
      <Button onClick={() => searchBooks()} disabled={isLoading}>
        {isLoading ? "Søker..." : "Søk"}
      </Button>
      <div className="mt-2">
        {totalResults > 0 && (
          <p className="text-sm">
            Viser {startIndex} - {endIndex} av {totalResults} resultater
          </p>
        )}
      </div>
      <div className="mt-4 max-h-64 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2">Tittel</TableHead>
              <TableHead className="p-2">Forfatter</TableHead>
              <TableHead className="p-2">Utgitt år</TableHead>
              <TableHead className="p-2">Antall sider</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((book, index) => (
              <TableRow key={index}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author_name}</TableCell>
                <TableCell>{book.first_publish_year}</TableCell>
                <TableCell>{book.number_of_pages_median || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() =>
                      onAddBook({
                        key: book.key,
                        title: book.title,
                        author_name: book.author_name,
                        first_publish_year: book.first_publish_year,
                        number_of_pages_median:
                          book.number_of_pages_median || null,
                        status: "backlog",
                      })
                    }
                  >
                    Legg til
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousClick}
          disabled={currentPage <= 1 || isLoading}
        >
          Tilbake
        </Button>
        <span>Side {currentPage}</span>
        <Button
          variant="outline"
          onClick={handleNextClick}
          disabled={
            currentPage > Math.ceil(totalResults / resultsPerPage) || isLoading
          }
        >
          Neste
        </Button>
      </div>
    </div>
  );
};
