"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

const SigninBtn = ({ provider }) => {
    switch (provider) {
        case "facebook":
            return <button onClick={() => signIn("facebook")}>Sign in with Facebook</button>;
        case "google":
            return <button onClick={() => signIn("google")}><Image width={25} height={25} alt="google-img" src="/images/google-img.png" ></Image> Sign in with Google</button>;
        default:
            break;
    }
};

export default SigninBtn;
