import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { queryClient } from "./lib/queryClient";
import { store } from "./store";
import { Toaster, TooltipProvider, Layout } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import { ScrollToTop } from "./utils";
import {
  Home,
  NewPost,
  PostDetails,
  MyPosts,
  Profile,
  Login,
  Register,
  NotFound,
} from "@/pages";

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
      <Route
        path="/"
        component={() => (
          <Layout>
            <Home />
          </Layout>
        )}
      />
      <Route
        path="/new-post"
        component={() => (
          <Layout>
            <NewPost />
          </Layout>
        )}
      />
      <Route
        path="/posts/:id"
        component={() => (
          <Layout>
            <PostDetails />
          </Layout>
        )}
      />
      <Route
        path="/my-posts"
        component={() => (
          <Layout>
            <MyPosts />
          </Layout>
        )}
      />
      <Route
        path="/profile"
        component={() => (
          <Layout>
            <Profile />
          </Layout>
        )}
      />

      {/* 404 page */}
      <Route
        component={() => (
          <Layout>
            <NotFound />
          </Layout>
        )}
      />
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
          <ScrollToTop />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export { App };
