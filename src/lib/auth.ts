import { cookies } from "next/headers";

/**
 * Get authentication token from various sources
 * Works in both server and client environments
 */
export function getAuthToken(): string | null {
    // Client-side: try localStorage first
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) return token;
    }

    // Server-side: try cookies (Note: this should be called from async contexts)
    // For server-side usage, use getServerAuthToken() instead

    return null;
}

/**
 * Get authentication token from cookies (server-side async version)
 */
export async function getServerAuthToken(): Promise<string | null> {
    if (typeof window === "undefined") {
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get("auth_token");
            return token?.value || null;
        } catch (error) {
            return null;
        }
    }
    return null;
}

/**
 * Set authentication token in localStorage (client-side only)
 */
export function setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
    }
}

/**
 * Remove authentication token (client-side only)
 */
export function removeAuthToken(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    const token = getAuthToken();
    return !!token;
}
