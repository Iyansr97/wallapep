export const defaultProductImage = "/imageMockup.png";

let imageVersions = {};

export let productImageUrl = (productId) => {
    let url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/images/" + productId + ".png";
    return imageVersions[productId] ? url + "?v=" + imageVersions[productId] : url;
}

export let isForSale = (product) => {
    return product.buyerId == null && product.buyerEmail == null;
}

export const productSortOptions = [
    { value: "newest", label: "Newest first", compare: (a, b) => b.id - a.id },
    { value: "priceAsc", label: "Price: low to high", compare: (a, b) => a.price - b.price },
    { value: "priceDesc", label: "Price: high to low", compare: (a, b) => b.price - a.price },
    { value: "title", label: "Title: A to Z", compare: (a, b) => a.title.localeCompare(b.title) },
];

export let sortProducts = (products, sortValue) => {
    let option = productSortOptions.find(o => o.value == sortValue) ?? productSortOptions[0];
    return [...products].sort(option.compare);
}

export let filterProducts = (products, filters) => {
    return products.filter(p => {
        if (filters.category != null && p.category != filters.category)
            return false;
        if (filters.status != null && (isForSale(p) ? "sale" : "sold") != filters.status)
            return false;
        if (filters.title && !p.title?.toLowerCase().includes(filters.title.trim().toLowerCase()))
            return false;
        if (filters.minPrice != null && p.price < filters.minPrice)
            return false;
        if (filters.maxPrice != null && p.price > filters.maxPrice)
            return false;
        return true;
    });
}

const maxViewedProducts = 5;

let viewedProductsKey = () => "viewedProducts_" + localStorage.getItem("id");

export let getViewedProducts = () => {
    try {
        return JSON.parse(localStorage.getItem(viewedProductsKey())) ?? [];
    } catch {
        return [];
    }
}

export let addViewedProduct = (productId) => {
    let others = getViewedProducts().filter(id => id != productId);
    localStorage.setItem(viewedProductsKey(), JSON.stringify([productId, ...others].slice(0, maxViewedProducts)));
}

export let uploadProductImage = async (productId, file) => {
    let formDataImage = new FormData();
    formDataImage.append('image', file);

    try {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products/" + productId + "/image", {
                method: "POST",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
                body: formDataImage
            })
        if (response.ok) {
            imageVersions[productId] = Date.now();
        }
        return response.ok;
    } catch {
        return false;
    }
}
