import { SFSymbol } from "expo-symbols";

export type ScreenType = "home" | "map" | "create" | "events" | "search" | "event";
export type MainScreenType = "home" | "map"
export type OtherScreenType = "create" | "events" | "search"

type MainViewType = {
  id: string,
  name: ScreenType,
  screen: React.JSX.Element,
  icon: SFSymbol,
}

type NavViewType = {
  id: string,
  name: ScreenType,
  screen: React.JSX.Element,
  icon: SFSymbol,
  mode: "page" | "modal"
}

type OtherViewType = {
  id: string,
  name: ScreenType,
  screen: React.JSX.Element,
  // icon: SFSymbol,
  mode: "page" | "modal"
}

export type ViewsType = {
  main: MainViewType[],
  nav: NavViewType[],
  other: OtherViewType[]
}