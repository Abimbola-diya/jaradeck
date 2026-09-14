/// <reference types="vite/client" />

// If you need SVGR support (import { ReactComponent } from '*.svg'):
declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
}
