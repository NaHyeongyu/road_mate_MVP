import { registerRootComponent } from "expo";
import "react-native-url-polyfill/auto";
import { createElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import App from "./App";

function Root() {
  return createElement(SafeAreaProvider, null, createElement(App));
}

registerRootComponent(Root);
