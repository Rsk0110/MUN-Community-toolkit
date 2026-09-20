import { useEffect } from "react";
import { SetupPage } from "./features/setup/SetupPage";
import { useSetupStore } from "./features/setup/setupStore";

export default function App() {
  const hydrate = useSetupStore((state) => state.hydrate);
  const isHydrated = useSetupStore((state) => state.isHydrated);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return <main className="loading-screen">Loading committee session...</main>;
  }

  return <SetupPage />;
}
