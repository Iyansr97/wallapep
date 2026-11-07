import Link from "next/link";
import { Card, Typography } from "antd";

let CategoryCardComponent = ({ category, count }) => {
    let Icon = category.icon;
    let empty = count == 0;

    let card =
        <Card hoverable={!empty} size="small" style={{ height: "100%", textAlign: "center", opacity: empty ? 0.5 : 1 }}>
            <div style={{
                width: 56, height: 56, margin: "4px auto 12px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: category.hex + "1a", color: category.hex, fontSize: 26
            }}>
                <Icon />
            </div>
            <Typography.Text strong style={{ display: "block" }}>{category.label}</Typography.Text>
            <Typography.Text type="secondary">
                {empty ? "No products yet" : count + (count == 1 ? " product" : " products")}
            </Typography.Text>
        </Card>;

    return empty ? card : <Link href={"/products?category=" + category.value}>{card}</Link>;
}

export default CategoryCardComponent;
