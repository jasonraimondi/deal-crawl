import { createPlaywrightRouter } from "crawlee";

export const ROUTES = {
  lowes: {
    root: "LOWES_ROOT",
    detail: "LOWES_DETAIL"
  },
  homeDepot: {
    root: "HOME_DEPOT_ROOT",
    detail: "HOME_DEPOT_DETAIL"
  },
};

export const playwrightRouter = createPlaywrightRouter();
