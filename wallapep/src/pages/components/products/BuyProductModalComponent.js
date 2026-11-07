import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Modal, Select, Spin, Typography, Space, Descriptions, Form, Result, Button } from "antd";
import { CreditCardOutlined, EnvironmentOutlined, SwapOutlined } from "@ant-design/icons";
import { creditCardLabel } from "../../../utils/UtilsCreditCards";
import { joinAllServerErrorMessages } from "../../../utils/UtilsValidations";
import UserLinkComponent from "../user/UserLinkComponent";
import UserReputationComponent from "../user/UserReputationComponent";
import PriceComponent from "../common/PriceComponent";
import FormFieldComponent from "../common/FormFieldComponent";
import RequiredFieldsNoteComponent from "../common/RequiredFieldsNoteComponent";

let BuyProductModalComponent = ({ product, open, onClose, onBought, openNotification }) => {
    let [creditCards, setCreditCards] = useState(null)
    let [buyerPaymentId, setBuyerPaymentId] = useState(null)
    let [buying, setBuying] = useState(false)
    let [sellerId, setSellerId] = useState(null)
    let [bought, setBought] = useState(null)
    let router = useRouter()

    useEffect(() => {
        if (!open || product == null)
            return;
        setBought(null)
        if (creditCards == null) {
            getCreditCards()
        }
        setSellerId(product.sellerId ?? null)
        if (product.sellerId == null) {
            getSellerId(product.id)
        }
    }, [open, product])

    let getCreditCards = async () => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/creditCards",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            setCreditCards(await response.json())
        } else {
            setCreditCards([])
        }
    }

    let getSellerId = async (productId) => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products/" + productId,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });
        if (response.ok) {
            setSellerId((await response.json()).sellerId)
        }
    }

    let buyProduct = async () => {
        setBuying(true)
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/transactions/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({
                    productId: product.id,
                    buyerPaymentId: buyerPaymentId
                })
            });
        setBuying(false)

        if (response.ok) {
            let jsonData = await response.json();
            if (jsonData.affectedRows == 1) {
                let card = creditCards.find(c => c.id == buyerPaymentId)
                setBought({ product: product, cardLabel: card ? creditCardLabel(card) : null })
                setBuyerPaymentId(null)
            }
        } else {
            let responseBody = await response.json();
            openNotification?.("top", joinAllServerErrorMessages(responseBody.errors), "error")
        }
    }

    let closeAfterPurchase = () => {
        onBought?.(bought.product)
    }

    if (bought != null) {
        return (
            <Modal open={open} onCancel={closeAfterPurchase} footer={
                <Space>
                    <Button onClick={closeAfterPurchase}>Keep browsing</Button>
                    <Button type="primary" icon={<SwapOutlined />}
                            onClick={() => { closeAfterPurchase(); router.push("/myTransactions"); }}>
                        View my transactions
                    </Button>
                </Space>}>
                <Result status="success" title="Purchase completed!"
                        subTitle={
                            <Space direction="vertical" size={2}>
                                <span>You bought <b>{bought.product.title}</b> for <b>{bought.product.price} €</b>.</span>
                                {bought.cardLabel && <span>Paid with {bought.cardLabel}.</span>}
                                <span>It will be sent to the address of your profile.</span>
                            </Space>} />
            </Modal>
        );
    }

    return (
        <Modal title={"Buy " + (product?.title ?? "")} open={open}
               okText="Confirm purchase" onOk={buyProduct} confirmLoading={buying}
               okButtonProps={{ disabled: buyerPaymentId == null }}
               onCancel={onClose}>
            <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Price"><PriceComponent price={product?.price} size={24} /></Descriptions.Item>
                <Descriptions.Item label="Seller">
                    {sellerId == null ? <Spin size="small" /> :
                        <Space direction="vertical" size={0}>
                            <UserLinkComponent userId={sellerId} />
                            <UserReputationComponent userId={sellerId} />
                        </Space>}
                </Descriptions.Item>
                <Descriptions.Item label={<Space size={4}><EnvironmentOutlined />Shipping</Space>}>
                    To the address of your profile
                </Descriptions.Item>
            </Descriptions>

            <Form layout="vertical">
            <RequiredFieldsNoteComponent />
            <FormFieldComponent label={<Space size={4}><CreditCardOutlined />Payment method</Space>} required>
                {creditCards == null ?
                    <Spin tip="Loading your credit cards..."><div style={{ height: 40 }} /></Spin> :
                    creditCards.length == 0 ?
                        <Typography.Text type="danger">You have no credit cards, you need one to buy.</Typography.Text> :
                        <Select placeholder="select a credit card" allowClear style={{ width: "100%" }}
                                value={buyerPaymentId}
                                onChange={(value) => setBuyerPaymentId(value ?? null)}
                                options={creditCards.map(c => ({ value: c.id, label: creditCardLabel(c) }))} />
                }
            </FormFieldComponent>
            </Form>
        </Modal>
    );
}

export default BuyProductModalComponent;
