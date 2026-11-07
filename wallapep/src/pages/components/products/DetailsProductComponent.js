import {useState, useEffect } from "react";
import Link from "next/link";
import { Typography, Card, Image, Button, Tag, Row, Col, Space, Spin, Grid, Alert } from 'antd';
import { ShoppingOutlined, CalendarOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DateComponent from "../common/DateComponent";
import { productImageUrl, defaultProductImage, isForSale, addViewedProduct } from "../../../utils/UtilsProducts";
import { getMyId } from "../../../utils/UtilsUsers";
import UserLinkComponent from "../user/UserLinkComponent";
import UserReputationComponent from "../user/UserReputationComponent";
import CategoryTagComponent from "./CategoryTagComponent";
import BuyProductModalComponent from "./BuyProductModalComponent";
import PriceComponent from "../common/PriceComponent";

let DetailsProductComponent  = ({id, openNotification}) => {
    let [product, setProduct] = useState(null)
    let [buyModalOpen, setBuyModalOpen] = useState(false)
    let [myId, setMyId] = useState(null)
    let screens = Grid.useBreakpoint()

    useEffect(() => {
        setMyId(getMyId())
    }, [])

    useEffect(() => {
        if (id != undefined) {
            getProduct(id);
        }
    }, [id])

    let getProduct = async (id) => {
         let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            setProduct(jsonData)
            addViewedProduct(jsonData.id)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let onBought = () => {
        setBuyModalOpen(false)
        getProduct(id)
    }

    if (product == null)
        return <Spin style={{ display: "block", marginTop: 40 }} />;

    let isSold = !isForSale(product)
    let isMine = myId != null && product.sellerId == myId

    return (
    <Card style={{ maxWidth: 680, margin: "0 auto" }}>
        <Row gutter={[32, 16]} align="top" wrap={!screens.sm}>
            <Col flex={screens.sm ? "220px" : "100%"}>
                <Image width="100%" style={{ maxHeight: 220, objectFit: "contain" }}
                       src={productImageUrl(product.id)} fallback={defaultProductImage} />
            </Col>
            <Col flex="auto" style={{ minWidth: 0 }}>
                <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 10, overflowWrap: "anywhere" }}>
                    { product.title }
                </Typography.Title>

                <Space size={16} wrap style={{ marginBottom: 16 }}>
                    <PriceComponent price={product.price} size={32} />
                    <CategoryTagComponent value={product.category} />
                    { isSold && <Tag icon={<CheckCircleOutlined />}>Sold</Tag> }
                </Space>

                <Typography.Paragraph type="secondary" style={{ whiteSpace: "pre-line", overflowWrap: "anywhere", marginBottom: 20, lineHeight: 1.7 }}
                                      ellipsis={{ rows: 3, expandable: true, symbol: "more" }}>
                    { product.description || "No description" }
                </Typography.Paragraph>

                <Space size={[48, 12]} wrap align="start" style={{ display: "flex", marginBottom: 24 }}>
                    <div>
                        <Typography.Text type="secondary" style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
                            <UserOutlined /> Seller
                        </Typography.Text>
                        <UserLinkComponent userId={ product.sellerId } />
                        <div><UserReputationComponent userId={ product.sellerId } /></div>
                    </div>
                    <div>
                        <Typography.Text type="secondary" style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
                            <CalendarOutlined /> Published
                        </Typography.Text>
                        <DateComponent timestamp={ product.date } icon={false} />
                    </div>
                </Space>

                { isSold ? null :
                  isMine ?
                    <Tag color="blue" style={{ display: "block", margin: 0, textAlign: "center", fontSize: 14, padding: "8px 10px" }}>Your product</Tag> :
                    <Button type="primary" block onClick={() => setBuyModalOpen(true)}
                            icon={<ShoppingOutlined/>} size="large">
                        Buy
                    </Button>
                }
            </Col>
        </Row>

        { isSold &&
            <Alert type="info" showIcon icon={<CheckCircleOutlined />} style={{ marginTop: 20 }}
                   message={
                       <Space size={6} wrap>
                           {isMine ? "You sold this product to" : "This product has already been sold to"}
                           <UserLinkComponent userId={ product.buyerId } />
                       </Space>}
                   action={product.category &&
                       <Link href={"/products?category=" + product.category}>
                           <Button size="small">See similar</Button>
                       </Link>} /> }

        <BuyProductModalComponent product={product} open={buyModalOpen}
                                  onClose={() => setBuyModalOpen(false)} onBought={onBought}
                                  openNotification={openNotification} />
    </Card>

    )
}

export default DetailsProductComponent;
