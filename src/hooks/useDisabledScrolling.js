import { useEffect } from "react";

function useDisabledScrolling(condition) {
  useEffect(() => {
    if (condition) {
      document.body.style.height = "100%";
      document.body.style.overflowY = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.height = "";
      document.body.style.overflowY = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.height = "";
      document.body.style.overflowY = "";
      document.body.style.touchAction = "";
    };
  }, [condition]);
}

export default useDisabledScrolling;
