// hooks/useFirebaseListener.ts
import { useEffect } from "react";
import { firebaseManager } from "../../main/firebase_manager";

export default function useFirebaseListener(
  path: string,
  onDataUpdate: (data: any) => void
) {
  useEffect(() => {
    firebaseManager.startListener(path, onDataUpdate);

    return () => {
      firebaseManager.stopListener(path);
    };
  }, [path, onDataUpdate]);
}
