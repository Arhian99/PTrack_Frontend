import { useContext } from "react";
import LoadingContext from "../context/LoadingProvider";

export default function useLoading() {
  return useContext(LoadingContext);
}
