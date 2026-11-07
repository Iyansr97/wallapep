let usersCache = {};
let transactionsCache = {};

export let getPublicUser = (userId) => {
    if (usersCache[userId] == null) {
        usersCache[userId] = fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/" + userId)
            .then(response => response.ok ? response.json() : null)
            .catch(() => null);
    }
    return usersCache[userId];
}

export let userDisplayName = (user) => {
    if (user == null)
        return null;
    return user.name || user.email;
}

let fetchPublicTransactions = async (query) => {
    let response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/transactions/public?" + query,
        {
            method: "GET",
            headers: {
                apikey: localStorage.getItem("apiKey"),
            },
        });
    return response.ok ? await response.json() : [];
}

export let getUserPublicTransactions = (userId) => {
    if (transactionsCache[userId] == null) {
        transactionsCache[userId] = Promise.all([
            fetchPublicTransactions("sellerId=" + userId),
            fetchPublicTransactions("buyerId=" + userId),
        ]).then(([sales, purchases]) => [
            ...sales.map(t => ({ ...t, type: "sale" })),
            ...purchases.map(t => ({ ...t, type: "purchase" })),
        ].sort((a, b) => b.id - a.id))
          .catch(() => []);
    }
    return transactionsCache[userId];
}

export let summarizeUserTransactions = (transactions) => {
    return {
        sales: transactions.filter(t => t.type == "sale").length,
        purchases: transactions.filter(t => t.type == "purchase").length,
        total: transactions.length,
        last: transactions[0] ?? null,
    };
}

export let loginUser = async (email, password) => {
    let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json " },
        body: JSON.stringify({ email: email, password: password })
    });

    let responseBody = await response.json();
    if (!response.ok)
        return { ok: false, errors: responseBody.errors };

    if (responseBody.apiKey && responseBody.email) {
        localStorage.setItem("apiKey", responseBody.apiKey)
        localStorage.setItem("email", responseBody.email)
        localStorage.setItem("id", responseBody.id)
    }
    return { ok: true };
}

export let getMyId = () => {
    return localStorage.getItem("id");
}
