/* eslint-disable react/prop-types */

import { useDeferredValue, useState, useRef, useMemo } from "react";
import SearchContext from "./SearchContext";
import { English } from "../constants/constants";

const SearchProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState(English);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [type, setType] = useState("Movies");
  const previousTypeRef = useRef(type);
  const previousLanguageRef = useRef(language);
  const [genre, setGenre] = useState([]);
  const [searchGenre, setSearchGenre] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [genreList, setGenreList] = useState({});
  const [isGenreEnabled, setIsGenreEnabled] = useState(false);
  const deferredQuery = useDeferredValue(searchQuery);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [localSelectedGenres, setLocalSelectedGenres] =
    useState(selectedGenres);
  const [isSearchedByTrending, setIsSearchedByTrending] = useState(null);
  const [searchResultsType, setSearchResultsType] = useState("");

  const contextValue = useMemo(
    () => ({
      items,
      setItems,
      totalPages,
      setTotalPages,
      currentPage,
      setCurrentPage,
      query,
      setQuery,
      searchQuery,
      setSearchQuery,
      language,
      setLanguage,
      loading,
      setLoading,
      error,
      setError,
      isGridView,
      setIsGridView,
      type,
      setType,
      genre,
      setGenre,
      searchGenre,
      setSearchGenre,
      hasSearched,
      setHasSearched,
      genreList,
      setGenreList,
      isGenreEnabled,
      setIsGenreEnabled,
      deferredQuery,
      selectedItem,
      setSelectedItem,
      selectedGenres,
      setSelectedGenres,
      isGenreModalOpen,
      setIsGenreModalOpen,
      localSelectedGenres,
      setLocalSelectedGenres,
      previousTypeRef,
      isSearchedByTrending,
      setIsSearchedByTrending,
      previousLanguageRef,
      searchResultsType,
      setSearchResultsType,
    }),
    [
      items,
      setItems,
      totalPages,
      setTotalPages,
      currentPage,
      setCurrentPage,
      query,
      setQuery,
      searchQuery,
      setSearchQuery,
      language,
      setLanguage,
      loading,
      setLoading,
      error,
      setError,
      isGridView,
      setIsGridView,
      type,
      setType,
      genre,
      setGenre,
      searchGenre,
      setSearchGenre,
      hasSearched,
      setHasSearched,
      genreList,
      setGenreList,
      isGenreEnabled,
      setIsGenreEnabled,
      deferredQuery,
      selectedItem,
      setSelectedItem,
      selectedGenres,
      setSelectedGenres,
      isGenreModalOpen,
      setIsGenreModalOpen,
      localSelectedGenres,
      setLocalSelectedGenres,
      previousTypeRef,
      isSearchedByTrending,
      setIsSearchedByTrending,
      previousLanguageRef,
      searchResultsType,
      setSearchResultsType,
    ]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
