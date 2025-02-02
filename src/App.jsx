import Container from "./components/Container";
import SearchProvider from "./context/SearchProvider.jsx";

function App() {
  return (
    <SearchProvider>
      <Container />
    </SearchProvider>
  );
}

export default App;
