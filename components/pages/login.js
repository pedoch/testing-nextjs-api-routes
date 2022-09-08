import React, { useEffect, useState } from "react";
import { getProviders, useSession, signIn, signOut } from "next-auth/react";
import { Button } from "../common";
import { useRouter } from "next/router";
import { ClientLink } from "../../pages/[[...path]]";

const Login = ({ providers }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    if (status === "unauthenticated") {
      setLoading(false);
    }

    if (status === "authenticated") {
      console.log("got here");
      window.location.href = "/";

      // router.push("/");
    }
  }, [session]);

  return (
    <div className="h-screen w-full flex justify-center items-center p-5">
      <div className="p-5 rounded w-full max-w-2xl shadow text-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {" "}
            <h1 className="text-2xl mb-5">Login</h1>
            <div className="flex flex-col items-center space-y-3">
              <Button
                className="bg-red-500 text-white max-w-fit"
                onClick={() => signIn(providers?.google?.id)}
              >
                {providers?.google?.name}
              </Button>
              {/* <Button
                className="max-w-fit"
                onClick={() => signIn(providers?.email?.id)}
              >
                {providers?.email?.name}
              </Button> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Login.getInitialProps = async (context) => {
  let data = {};
  try {
    data = await getProviders();
  } catch (error) {
    console.error(error);
  }
  return {
    providers: data,
  };
};

export default Login;
