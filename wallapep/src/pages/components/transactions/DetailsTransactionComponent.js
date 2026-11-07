import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Image, Result, Spin, Row, Col, Space, Typography, Button, Divider, Tag, Badge } from "antd";
import {
    FileTextOutlined, EnvironmentOutlined, CreditCardOutlined, CalendarOutlined,
    ArrowLeftOutlined, CheckCircleOutlined
} from "@ant-design/icons";
import DateComponent from "../common/DateComponent";
import { productImageUrl, defaultProductImage } from "../../../utils/UtilsProducts";
import { creditCardLabel } from "../../../utils/UtilsCreditCards";
import { getMyId } from "../../../utils/UtilsUsers";
import UserLinkComponent from "../user/UserLinkComponent";
import UserReputationComponent from "../user/UserReputationComponent";
import TransactionTypeTagComponent from "./TransactionTypeTagComponent";
import CategoryTagComponent from "../products/CategoryTagComponent";
import PageTitleComponent from "../common/PageTitleComponent";

let DetailsTransactionComponent = ({ id }) => {
    let [transaction, setTransaction] = useState(undefined);
    let [creditCard, setCreditCard] = useState(null);
    let [myId, setMyId] = useState(null);

    useEffect(() => {
        setMyId(getMyId());
    }, []);

    useEffect(() => {
        if (id != undefined) {
            getTransaction();
        }
    }, [id]);

    let getTransaction = async () => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/transactions/own",
            {
                method: "GET",
                headers: {
                    apikey: localStorage.getItem("apiKey"),
                },
            }
        );

        if (!response.ok) {
            setTransaction(null);
            return;
        }

        let jsonData = await response.json();
        let t = jsonData.find(t => t.tid == id) ?? null;
        setTransaction(t);
        if (t == null)
            return;

        if (t.buyerPaymentId != null && t.buyerId == getMyId()) {
            getCreditCard(t.buyerPaymentId);
        }
    };

    let getCreditCard = async (cardId) => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/creditCards/" + cardId,
            {
                method: "GET",
                headers: {
                    apikey: localStorage.getItem("apiKey"),
                },
            }
        );
        if (response.ok) {
            setCreditCard(await response.json());
        }
    };

    let paymentText = () => {
        if (transaction.buyerPaymentId == null)
            return <Typography.Text type="secondary">No info</Typography.Text>;
        if (creditCard != null)
            return creditCardLabel(creditCard);
        return "Paid by card";
    };

    let backLink = <Link href="/myTransactions"><Button icon={<ArrowLeftOutlined />}>My transactions</Button></Link>;

    if (transaction === undefined)
        return <Spin style={{ display: "block", marginTop: 40 }} />;

    if (transaction == null)
        return <Result status="404" title="Transaction not found"
                       subTitle="It does not exist or you did not take part in it."
                       extra={backLink} />;

    let isPurchase = transaction.buyerId == myId;
    let addressLines = [transaction.buyerAddress,
                        [transaction.buyerPostCode, transaction.buyerCountry].filter(x => x).join(" · ")]
        .filter(x => x);

    let sectionTitle = (icon, title) =>
        <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
            <Space size={6}><span style={{ color: "#1677ff" }}>{icon}</span>{title}</Space>
        </Typography.Text>;

    let otherUserId = isPurchase ? transaction.sellerId : transaction.buyerId;

    return (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <PageTitleComponent icon={<FileTextOutlined />} title={isPurchase ? "Purchase details" : "Sale details"} extra={backLink} />

            <Card>
                <Row gutter={[16, 16]} align="middle" wrap={false}>
                    <Col flex="none">
                        <Image width={96} height={96} style={{ objectFit: "contain", background: "#fafafa", borderRadius: 8 }}
                               src={productImageUrl(transaction.productId)} fallback={defaultProductImage} preview={false} />
                    </Col>
                    <Col flex="auto" style={{ minWidth: 0 }}>
                        <Space size={8} wrap style={{ marginBottom: 4 }}>
                            <TransactionTypeTagComponent type={isPurchase ? "purchase" : "sale"} />
                            <CategoryTagComponent value={transaction.category} />
                        </Space>
                        <Typography.Title level={4} style={{ margin: "4px 0 8px", overflowWrap: "anywhere" }}>
                            {transaction.title}
                        </Typography.Title>
                        <Space size={6} wrap>
                            <Typography.Text type="secondary">{isPurchase ? "Bought from" : "Sold to"}</Typography.Text>
                            <UserLinkComponent userId={otherUserId} />
                            <UserReputationComponent userId={otherUserId} />
                        </Space>
                    </Col>
                    <Col flex="none" style={{ textAlign: "right" }}>
                        <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>
                            {isPurchase ? "You paid" : "You earned"}
                        </Typography.Text>
                        <Typography.Text strong type={isPurchase ? "danger" : "success"} style={{ fontSize: 30, lineHeight: 1.2 }}>
                            {isPurchase ? "-" : "+"}{transaction.productPrice} €
                        </Typography.Text>
                        <div>
                            {transaction.startDate ?
                                <DateComponent timestamp={transaction.startDate} /> :
                                <Typography.Text type="secondary">No date info</Typography.Text>}
                        </div>
                        <Link href={`/detailProduct/${transaction.productId}`}>View product →</Link>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={8}>
                        {sectionTitle(<EnvironmentOutlined />, "Shipping address")}
                        {addressLines.length > 0 ?
                            addressLines.map(line => <Typography.Paragraph key={line} style={{ marginBottom: 4 }}>{line}</Typography.Paragraph>) :
                            <Typography.Text type="secondary">No info</Typography.Text>}
                    </Col>
                    <Col xs={24} sm={8}>
                        {sectionTitle(<CreditCardOutlined />, "Payment method")}
                        <Typography.Text>{paymentText()}</Typography.Text>
                    </Col>
                    <Col xs={24} sm={8}>
                        {sectionTitle(<CalendarOutlined />, "Status")}
                        {transaction.startDate ?
                            <Space direction="vertical" size={6}>
                                {transaction.endDate ?
                                    <Tag color="success" icon={<CheckCircleOutlined />}>Completed</Tag> :
                                    <Badge status="processing" text={<Typography.Text strong>In progress</Typography.Text>} />}
                                <Space size={6}>
                                    <Typography.Text type="secondary">Purchased</Typography.Text>
                                    <DateComponent timestamp={transaction.startDate} icon={false} />
                                </Space>
                                {transaction.endDate &&
                                    <Space size={6}>
                                        <Typography.Text type="secondary">Completed</Typography.Text>
                                        <DateComponent timestamp={transaction.endDate} icon={false} />
                                    </Space>}
                            </Space> :
                            <Typography.Text type="secondary">No info</Typography.Text>}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default DetailsTransactionComponent;
