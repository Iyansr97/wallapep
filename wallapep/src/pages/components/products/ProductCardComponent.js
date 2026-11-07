import Link from "next/link";
import { useRouter } from "next/router";
import { Card, Button, Space, Typography, Badge } from "antd";
import { ShoppingCartOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { productImageUrl, defaultProductImage } from "../../../utils/UtilsProducts";
import CategoryTagComponent from "./CategoryTagComponent";
import PriceComponent from "../common/PriceComponent";

let ProductCardComponent = ({ product, onBuy, isMine, viewed }) => {
    let router = useRouter();
    let detailUrl = `/detailProduct/${product.id}`;
    let openDetail = () => router.push(detailUrl);
    let stop = (e) => e.stopPropagation();

    let actions = undefined;
    if (isMine) {
        actions = [
            <Link key="mine" href={`/editProduct/${product.id}`} style={{ display: "block" }} onClick={stop}>
                <Button type="text" block className="card-action-button" icon={<EditOutlined />}>
                    Edit
                </Button>
            </Link>
        ];
    } else if (onBuy) {
        actions = [
            <Button key="buy" type="text" block className="card-action-button card-action-buy"
                    icon={<ShoppingCartOutlined />} onClick={(e) => { stop(e); onBuy(product); }}>Buy</Button>
        ];
    }

    let card = (
        <Card hoverable size="small" className="product-card" style={{ height: "100%", cursor: "pointer" }}
              actions={actions} onClick={openDetail}
              role="link" tabIndex={0} aria-label={viewed ? product.title + " (viewed)" : product.title}
              onKeyDown={(e) => { if (e.key == "Enter" && e.target == e.currentTarget) openDetail(); }}
              cover={
                  <div className="product-card-cover">
                      {viewed && <span className="product-card-viewed"><EyeOutlined /> Viewed</span>}
                      <img alt={product.title}
                           style={{ height: 160, width: "100%", objectFit: "contain" }}
                           src={productImageUrl(product.id)}
                           onError={(e) => { e.currentTarget.src = defaultProductImage }} />
                  </div>}>
            <Link href={detailUrl} onClick={stop}>
                <Typography.Text ellipsis={{ tooltip: product.title }} style={{ display: "block" }}>
                    {product.title}
                </Typography.Text>
            </Link>
            <Space style={{ marginTop: 8, width: "100%", justifyContent: "space-between" }} wrap>
                <PriceComponent price={product.price} size={20} />
                <CategoryTagComponent value={product.category} />
            </Space>
        </Card>
    );

    if (!isMine)
        return card;

    return (
        <Badge.Ribbon text="Your product" color="blue" rootClassName="product-card-ribbon">
            {card}
        </Badge.Ribbon>
    );
}

export default ProductCardComponent;
