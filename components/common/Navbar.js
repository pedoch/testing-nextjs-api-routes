import { Button } from "./Button";
import { useRouter } from "next/router";
import { ClientLink } from "../../pages/[[...path]]";

export const Navbar = ({ user }) => {
  const router = useRouter();
  return (
    <div className="w-full flex justify-between">
      <p className="text-2xl font-semibold">Welcome{` ${user?.name || ""}`}!</p>
      <div className="space-x-2">
        <Button onClick={() => (window.location.href = "/")}>Home</Button>
        {user && (
          <Button
            // disabled={loadingProviders}
            onClick={() => router.push("/api/auth/logout")}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};
