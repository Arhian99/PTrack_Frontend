import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

// this custom hook returns the global auth context 
export default function useAuth() {
  return useContext(AuthContext);
}
