import React, {
  Children,
  ComponentProps,
  MouseEventHandler,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { useState } from "react";
import Home from "../components/pages/home";
import Login from "../components/pages/login";
import CreateQuiz from "../components/pages/quiz/create";
import Submissions from "../components/pages/quiz/submissions";
import TakeQuiz from "../components/pages/quiz/take";

export const ClientRouterContext = React.createContext({
  route: "/",
  setRoute: (route, replace) => {},
});

export const ClientRoute = ({ component, path }) => {
  const { route } = useContext(ClientRouterContext);

  return route === `/${path}` ? component : null;
};

export const ClientLink = ({ children, to, replace, ...restProps }) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <a href={to} onClick={handleClick} {...restProps}>
      {children}
    </a>
  );
};

export const ClientRouter = ({ children, whileLoading }) => {
  const { setRoute } = useContext(ClientRouterContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    syncWithUrl();
    window.onhashchange = (e) => {
      syncWithUrl();
    };
    window.addEventListener("popstate", handlePopState);
    setLoading(false);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handlePopState = () => {
    syncWithUrl();
  };

  const syncWithUrl = () => {
    setRoute(window.location.pathname);
  };

  return <>{loading ? whileLoading : children}</>;
};

export const ClientRouterProvider = ({ children }) => {
  const [route, setRoute] = useState("/");

  return (
    <ClientRouterContext.Provider
      value={{
        route,
        setRoute,
      }}
    >
      {children}
    </ClientRouterContext.Provider>
  );
};

// usage
const App = () => {
  // const { user } = useAuth();
  // const { summary } = useSummary({ user });

  return (
    <ClientRouterProvider>
      <ClientRouter whileLoading={<p>Loading</p>}>
        <ClientRoute path="login" component={<Login />} />
        <ClientRoute path="quiz/form" component={<CreateQuiz />} />
        <ClientRoute path="quiz/submissions" component={<Submissions />} />
        <ClientRoute path="q" component={<TakeQuiz />} />
        <ClientRoute path="" component={<Home />} />
      </ClientRouter>
    </ClientRouterProvider>
  );
};

export default App;
