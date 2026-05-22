export async function signUp(name, email, password) {
    const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    return data.user;
}

export async function login(email, password) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data.user;
}

export async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
}

export async function getMe() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    return data.user;
}