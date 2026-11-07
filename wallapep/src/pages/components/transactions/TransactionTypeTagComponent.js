import { Tag } from "antd";
import { ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";

export const transactionTypeFilters = [
    { text: "Purchase", value: "purchase" },
    { text: "Sale", value: "sale" },
];

let TransactionTypeTagComponent = ({ type }) => {
    return type == "purchase" ?
        <Tag color="green" icon={<ShoppingCartOutlined />}>Purchase</Tag> :
        <Tag color="blue" icon={<ShopOutlined />}>Sale</Tag>;
}

export default TransactionTypeTagComponent;
