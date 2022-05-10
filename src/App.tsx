import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Index from "./pages/Index";
import {store} from "./store";
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Create from "./pages/Create";

export const App = () => (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Redirect to="/index" />
            </Route>
            <Route exact path="/index" component={Index} />
            <Route exact path="/create" component={Create} />
          </Switch>
        </Router>

      </ChakraProvider>
    </Provider>
);
