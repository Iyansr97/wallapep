export let creditCardLabel = (creditCard) => {
    return (creditCard.alias ?? "Card") + " ···" + String(creditCard.number).slice(-4);
}
