import { useState, useEffect } from "react";

const KEY = "35c1a923";

export const useMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Something Went Wrong !!");
        }

        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not Found !!");
        }
        setMovies(data.Search);
        setError("");
      } catch (e) {
        // console.error(e.message);
        if (e.name !== "AbortError") {
          setError(e.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    //   handleCloseMovie();
    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
};
