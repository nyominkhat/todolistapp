import { Button } from "@tremor/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signIn("google", { callbackUrl: router.query.callbackUrl });
  };

  return (
    <section className="flex items-center justify-center w-screen h-screen ">
      <Button onClick={handleSignIn}>Sign in with Google</Button>
    </section>
  );
}
