import { useState } from "react";
import { InputNumber, Button, Space, Tooltip } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { joinAllServerErrorMessages } from "../../../utils/UtilsValidations";
import PriceComponent from "../common/PriceComponent";

let EditablePriceComponent = ({ product, editable, onSaved, openNotification, highlight }) => {
    let [editing, setEditing] = useState(false);
    let [price, setPrice] = useState(product.price);
    let [saving, setSaving] = useState(false);

    let save = async () => {
        if (price == null || price <= 0)
            return;
        setSaving(true);
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products/" + product.id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({
                    title: product.title,
                    description: product.description,
                    category: product.category,
                    price: price
                })
            });
        setSaving(false);

        if (response.ok) {
            setEditing(false);
            onSaved?.({ ...product, price: price });
            openNotification?.("top", "Price updated", "success");
        } else {
            let responseBody = await response.json();
            openNotification?.("top", joinAllServerErrorMessages(responseBody.errors), "error");
        }
    };

    let cancel = () => {
        setPrice(product.price);
        setEditing(false);
    };

    if (!editing) {
        return (
            <Space size={4}>
                <span className={highlight ? "flash-highlight" : undefined} style={{ padding: "2px 4px" }}>
                    <PriceComponent price={product.price} />
                </span>
                {editable &&
                    <Tooltip title="Change price">
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setEditing(true)} />
                    </Tooltip>}
            </Space>
        );
    }

    return (
        <Space.Compact>
            <InputNumber size="small" min={0.01} precision={2} value={price} autoFocus
                         style={{ width: 100 }} addonAfter="€"
                         onChange={setPrice} onPressEnter={save} />
            <Button size="small" type="primary" icon={<CheckOutlined />} loading={saving}
                    disabled={price == null || price <= 0} onClick={save} />
            <Button size="small" icon={<CloseOutlined />} onClick={cancel} />
        </Space.Compact>
    );
}

export default EditablePriceComponent;
