export let transactionType = (transaction, myId) => {
    return transaction.buyerId == myId ? "purchase" : "sale";
}

export let filterTransactions = (transactions, filters, myId) => {
    return transactions.filter(t => {
        if (filters.type != null && transactionType(t, myId) != filters.type)
            return false;
        if (filters.category != null && t.category != filters.category)
            return false;
        if (filters.title && !t.title?.toLowerCase().includes(filters.title.trim().toLowerCase()))
            return false;
        if (filters.minAmount != null && t.productPrice < filters.minAmount)
            return false;
        if (filters.maxAmount != null && t.productPrice > filters.maxAmount)
            return false;
        return true;
    });
}
