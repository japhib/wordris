import { useState } from "react";

// Hook to force a re-render of a component.
// See: https://stackoverflow.com/a/53837442/530728
export default function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}