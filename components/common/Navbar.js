import { Button } from "./Button";
import { useRouter } from "next/router";

export const Navbar = ({ user }) => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-between">
      <p className="text-2xl font-semibold">Welcome{` ${user?.name || ""}`}!</p>
      {user && (
        <Button
          // disabled={loadingProviders}
          onClick={() => router.push("/api/auth/logout")}
        >
          Logout
        </Button>
      )}
    </div>
  );
};
