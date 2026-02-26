"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleAuthCallback } from "@/lib/auth";

/**
 * Invisible component that intercepts `?token=xxx` from the OAuth callback.
 * Mount this in the root layout so it works regardless of which page
 * the backend redirects to.
 */
export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const found = handleAuthCallback();
        if (found) {
            // Token was captured and stored — refresh to load authenticated state
            router.replace("/");
        }
    }, [router]);

    return null;
}
