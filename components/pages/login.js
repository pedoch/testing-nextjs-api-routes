import React, { useEffect, useState } from "react";
// import { getProviders, useSession, signIn, signOut } from "next-auth/react";
import { Button } from "../common";
import { ClientLink } from "../../pages/[[...path]]";
import { useRouter } from "next/router";
// import { ClientLink } from "../../pages/[[...path]]";
import { useUser } from "@auth0/nextjs-auth0";

const Login = () => {
  // const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  // const [loadingProviders, setLoadingProviders] = useState(true);
  // const [providers, setProviders] = useState();
  const router = useRouter();

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    console.log(user);

    if (!isLoading) {
      if (user) {
        window.location.href = "/";

        // router.push("/");
      } else {
        setLoading(false);
      }
    }
  }, [isLoading]);

  // useEffect(() => {
  //   fetchProviders();
  // }, []);

  // const fetchProviders = async () => {
  //   let incomingProviders;
  //   try {
  //     const data = await getProviders();

  //     console.log(data);

  //     incomingProviders = data;
  //   } catch (error) {
  //   } finally {
  //     setProviders(incomingProviders);
  //     setLoadingProviders(false);
  //   }
  // };

  return (
    <div className="h-screen w-full flex justify-center items-center p-5">
      <div className="p-5 rounded w-full max-w-2xl shadow text-center">
        {loading || isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error.message}</p>
        ) : (
          <>
            {" "}
            <h1 className="text-2xl mb-5">Login</h1>
            <div className="flex flex-col items-center space-y-3">
              {/* <ClientLink to=""> */}
              <Button
                // className="max-w-fit"
                // disabled={loadingProviders}
                onClick={() => router.push("/api/auth/login")}
              >
                Login
              </Button>
              {/* </ClientLink> */}
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

export default Login;
