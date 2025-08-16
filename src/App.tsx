import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { queryClient } from "./lib/queryClient";
import { store } from "./store";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout/Layout";
import { useTheme } from "@/hooks/useTheme";
import { Home } from "@/pages/Home";
import { NewPost } from "@/pages/NewPost";
import { PostDetails } from "@/pages/PostDetails";
import { MyPosts } from "@/pages/MyPosts";
import { Profile } from "@/pages/Profile";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { NotFound } from "@/pages/not-found";
import { ScrollToTop } from "./utils";

function ThemeProvider() {
  useTheme(); // Initialize theme
  return null;
}

function Router() {
  return (
    <Switch>
      {/* Auth pages without layout */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Main app pages with layout */}
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/new-post" component={() => <Layout><NewPost /></Layout>} />
      <Route path="/posts/:id" component={() => <Layout><PostDetails /></Layout>} />
      <Route path="/my-posts" component={() => <Layout><MyPosts /></Layout>} />
      <Route path="/profile" component={() => <Layout><Profile /></Layout>} />
      
      {/* 404 page */}
      <Route component={() => <Layout><NotFound /></Layout>} />
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider />
          <Toaster />
          <ScrollToTop/>
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export { App };
