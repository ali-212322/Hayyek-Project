// Delegate all auth state to AuthContext so every component shares the same state.
import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => useAuthContext();

export default useAuth;
