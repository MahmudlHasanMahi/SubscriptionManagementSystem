import { StrictMode } from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "./Utils/i18n";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const queryClient = new QueryClient();

root.render(
  <BrowserRouter basename="yasier/">
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer autoClose={3000} closeOnClick={true} theme="dark" />
        <App />
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);
