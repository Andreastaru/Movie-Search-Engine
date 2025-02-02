import { useEffect } from "react";

function useDisabledScrolling(condition) {
  useEffect(() => {
    if (condition) {
      document.body.style.height = "100%";
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.height = "";
      document.body.style.overflowY = "";
    }

    return () => {
      document.body.style.height = "";
      document.body.style.overflowY = "";
    };
  }, [condition]);
}

export default useDisabledScrolling;
