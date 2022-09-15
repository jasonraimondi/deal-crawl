import { JSX } from "preact";

export function Anchor(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      class="text-blue-500 hover:text-blue-800"
    >
      {props.children}
    </a>
  );
}