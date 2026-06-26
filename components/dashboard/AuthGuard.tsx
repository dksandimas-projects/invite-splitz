"use client";

import * as React from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAuthorizedEmails } from "@/lib/firestore";
import { signOutUser, signInWithGoogle, signInWithEmail } from "@/lib/auth";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { FormField } from "@/components/shared/FormField";

type AuthStatus = "loading" | "unauthenticated" | "denied" | "authorized";

interface AuthContextValue {
  user: User | null;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthGuard>");
  }
  return ctx;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (next) => {
      if (!next) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }
      // Signed in — verify email against the allowlist
      try {
        const emails = await getAuthorizedEmails();
        if (!next.email || !emails.includes(next.email)) {
          await signOutUser();
          setUser(null);
          setStatus("denied");
          return;
        }
        setUser(next);
        setStatus("authorized");
      } catch (err) {
        // If the access check itself fails (network, perms), sign out for safety
        console.error("AuthGuard: failed to fetch authorized emails", err);
        await signOutUser();
        setUser(null);
        setStatus("unauthenticated");
      }
    });
    return unsub;
  }, []);

  if (status === "loading") {
    return <AuthLoading />;
  }

  if (status === "unauthenticated") {
    return <SignInScreen />;
  }

  if (status === "denied") {
    return <AccessDeniedScreen email={user?.email ?? null} />;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function AuthLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function SignInScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailSubmitting, setEmailSubmitting] = React.useState(false);
  const [googleSubmitting, setGoogleSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogle = async () => {
    setGoogleSubmitting(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setError("Google sign-in failed. Please try again.");
      }
      setGoogleSubmitting(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitting(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Incorrect email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
      setEmailSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white shadow-soft border border-stone rounded-xl p-8 flex flex-col items-center">
        <h1 className="font-serif text-section-heading text-charcoal text-center mb-1">
          Bretch &amp; Joyce
        </h1>
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey text-center mb-6">
          Dashboard
        </p>
        <div className="w-16 h-px bg-sunflower mb-6" />
        <p className="text-sm text-warm-grey text-center mb-8 leading-relaxed">
          Sign in to manage your guest list and invite links.
        </p>

        <form className="w-full space-y-4" onSubmit={handleEmail}>
          <FormField label="Email" htmlFor="signin-email">
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={emailSubmitting}
            />
          </FormField>
          <FormField label="Password" htmlFor="signin-password">
            <Input
              id="signin-password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={emailSubmitting}
            />
          </FormField>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={emailSubmitting}
            disabled={emailSubmitting}
            fullWidth
          >
            Sign In
          </Button>
          {error ? (
            <p className="text-xs text-red-500 text-center">{error}</p>
          ) : null}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-stone" />
            <span className="text-[10px] tracking-widest uppercase text-warm-grey">or</span>
            <div className="flex-1 h-px bg-stone" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleGoogle}
            loading={googleSubmitting}
            disabled={googleSubmitting || emailSubmitting}
            fullWidth
          >
            <span className="inline-flex items-center gap-2">
              <span className="font-semibold text-garden">G</span>
              Sign in with Google
            </span>
          </Button>
        </form>

        <p className="mt-8 text-xs text-warm-grey text-center leading-relaxed max-w-[240px]">
          Access is restricted to authorized accounts only.
        </p>
      </div>
    </div>
  );
}

function AccessDeniedScreen({ email }: { email: string | null }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white shadow-soft border border-stone rounded-xl p-8 flex flex-col items-center text-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7A7670"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h2 className="font-serif text-xl text-charcoal mt-4 mb-2">
          Access Denied
        </h2>
        <p className="text-sm text-warm-grey leading-relaxed mb-2">
          This dashboard is private. Your account is not authorized to access
          it.
        </p>
        {email ? (
          <p className="text-xs text-warm-grey mb-4">Signed in as {email}</p>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOutUser().then(() => window.location.reload())}
        >
          Sign out and try a different account
        </Button>
      </div>
    </div>
  );
}
