import {
    LaptopOutlined, PlaySquareOutlined, MobileOutlined, HomeOutlined,
    TrophyOutlined, SkinOutlined, BookOutlined, TagOutlined
} from "@ant-design/icons";

export const categories = [
    { value: "electronica", label: "Electronics", icon: LaptopOutlined, color: "blue", hex: "#1677ff" },
    { value: "consola", label: "Consoles & games", icon: PlaySquareOutlined, color: "purple", hex: "#722ed1" },
    { value: "movil", label: "Phones", icon: MobileOutlined, color: "cyan", hex: "#13c2c2" },
    { value: "hogar", label: "Home", icon: HomeOutlined, color: "orange", hex: "#fa8c16" },
    { value: "deporte", label: "Sports", icon: TrophyOutlined, color: "green", hex: "#52c41a" },
    { value: "ropa", label: "Clothing", icon: SkinOutlined, color: "magenta", hex: "#eb2f96" },
    { value: "libros", label: "Books", icon: BookOutlined, color: "gold", hex: "#faad14" },
];

export const otherCategory = { value: "otros", label: "Others", icon: TagOutlined, color: "default", hex: "#8c8c8c" };

export let findCategory = (value) => {
    return categories.find(c => c.value == value) ?? otherCategory;
}

export let categoryLabel = (value) => {
    return categories.find(c => c.value == value)?.label ?? value;
}

export let countByCategory = (products) => {
    let counts = {};
    products.forEach(p => {
        counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
}
