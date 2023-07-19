import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.scss";
import Calendar from "./components/Calendar/Calendar";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Calendar />
    </QueryClientProvider>
  );
}

export default App;
