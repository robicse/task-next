import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { getLoginToken } from "../../../services/getLoginToken";
import { getMagicToken } from "../../../services/getMagicToken";
import { checkUserExistByGoogleLogin } from "@/app/services/checkUserExistByGoogleLogin";
import { googleLoginAPI } from "@/app/services/googleLogin";
function getRequestPath() {
    if (typeof window !== "undefined") {
        try {
            const requestPage = localStorage.getItem("requestPage");
            
            // If the value exists, parse it; otherwise, default to "/dashboard"
            const requestRoute = requestPage
                ? JSON.parse(requestPage)
                : "/dashboard";

            return requestRoute;
        } catch (error) {
            // Handle any errors during retrieval or parsing
            console.error("Error retrieving or parsing requestPage:", error);
            return "/dashboard"; // Fallback in case of error
        }
    }
    return "/dashboard"; // Fallback if window is undefined
}

let profileData = null;
let userStatus = null;
let signInStatus = null;

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {},
                password: {},
            },
            async authorize(credentials, req) {
                if (credentials === null) return null;
                try {
                    const res = await getLoginToken({
                        phone: credentials?.username,
                        password: credentials?.password,
                    });

                    if (res.error) {
                        throw new Error("Email or Password is not correct");
                    }

                    if (res.user) {
                        const user = {
                            id: res?.user?.id,
                            name: res?.user?.name,
                            email: res?.user?.email,
                        };

                        // Example accessToken and expiresIn, replace with actual token logic
                        const accessToken = res?.user?.accessToken;
                        // const expiresIn = 3600; // Token expiration time in seconds
                        const expiresIn = res?.user?.expiresIn;

                        const phone = res?.user?.phone;

                        return { ...user, accessToken, expiresIn, phone };
                    }
                    return null;
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error(error.message);
                }
            },
        }),
        CredentialsProvider({
            id: "magic",
            name: "Magic",
            credentials: {
                username: { label: "token", type: "text" },
            },
            async authorize(credentials, req) {
                if (credentials === null) return null;
                try {
                    const res = await getMagicToken({
                        token: credentials?.token,
                    });

                    if (res.error) {
                        throw new Error("Email or Username is not correct");
                    }

                    if (res.user) {
                        const user = {
                            id: res?.user?.id,
                            name: res?.user?.name,
                            email: res?.user?.email,
                        };

                        // Example accessToken and expiresIn, replace with actual token logic
                        const accessToken = res?.user?.accessToken;
                        // const expiresIn = 3600; // Token expiration time in seconds
                        const expiresIn = res?.user?.expiresIn;

                        const phone = res?.user?.phone;

                        return { ...user, accessToken, expiresIn, phone };
                    }
                    return null;
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error(error.message);
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                signInStatus = "login";
                const formData = {
                    provider_account_id: account?.providerAccountId || "",
                    name: profile?.name || "",
                    email: profile?.email || "",
                };
                const googleLogin = await googleLoginAPI(formData);
                user.accessToken = googleLogin?.user?.accessToken;
                user.expiresIn = googleLogin?.user?.expiresIn;
                user.name = profile?.name;
                user.email = profile?.email;

                // Simulate an asynchronous operation that assigns a value to 'profileData'
                new Promise((resolve) => {
                    setTimeout(() => {
                        profileData = profile;
                        resolve();
                    }, 1000); // Simulate a 1-second delay
                });

                const userExists = await checkUserExistByGoogleLogin({
                    email: profile?.email,
                });

                if (userExists) {
                    if (
                        userExists?.message == "Already User Exists" &&
                        (userExists?.account_provider == "credentials" ||
                            userExists?.account_provider == "google")
                    ) {
                        userStatus = "complete";
                    } else {
                        userStatus = "no complete";
                    }
                }
                return { ...user };
            }
            return true;
        },

        async redirect({ url, baseUrl }) {
            try {
                if (
                    signInStatus == "login" &&
                    profileData &&
                    profileData.email &&
                    userStatus == "complete"
                ) {
                    return `${baseUrl}/${getRequestPath()}`;
                } else if (
                    signInStatus == null &&
                    profileData &&
                    profileData.email &&
                    userStatus == "no complete"
                ) {
                    return url.startsWith(baseUrl)
                        ? `${baseUrl}/new-user`
                        : baseUrl;
                } else {
                    return `${baseUrl}`;
                }
            } catch (error) {
                console.error("=>>> profileData 5 error", error.message);
                return url.startsWith(baseUrl) ? `${baseUrl}` : baseUrl;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.expiresIn = user.expiresIn;
                token.phone = user.phone;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken;
                session.expiresIn = token.expiresIn;
                session.phone = token.phone;
            }
            return session;
        },
    },
    pages: {
        newUser: "/dashboard",
    },
    pages: {
        signOut: "/", // Redirect to home page or another URL after logout
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
