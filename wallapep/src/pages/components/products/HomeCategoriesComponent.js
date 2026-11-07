import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Col, Row, Typography, Button, Space, Spin } from "antd";
import {
    HomeOutlined, LoginOutlined, UserAddOutlined, ShoppingCartOutlined, ShopOutlined,
    SwapOutlined, AppstoreOutlined, PlusOutlined
} from "@ant-design/icons";
import { categories, countByCategory } from "../../../utils/UtilsCategories";
import { isForSale } from "../../../utils/UtilsProducts";
import CategoryCardComponent from "./CategoryCardComponent";
import PageTitleComponent from "../common/PageTitleComponent";

const description =
    "Wallapep is a second-hand marketplace between individuals. Put up for sale the things you no longer " +
    "use to give them a second life, and find good deals sold by other users.";

const features = [
    { icon: <ShoppingCartOutlined />, title: "Buy", text: "Find second-hand products by category, title or price and buy them in a couple of clicks." },
    { icon: <ShopOutlined />, title: "Sell", text: "Publish what you no longer use with a photo, a description and your price." },
    { icon: <SwapOutlined />, title: "Keep track", text: "Check your purchases and sales, and see the reputation of other users." },
];

const shortcuts = [
    { href: "/products", icon: <ShopOutlined />, title: "Browse products", text: (n) => n + " products for sale" },
    { href: "/createProduct", icon: <PlusOutlined />, title: "Sell a product", text: () => "Publish something you no longer use" },
    { href: "/myProducts", icon: <AppstoreOutlined />, title: "My products", text: () => "Manage your products and prices" },
    { href: "/myTransactions", icon: <SwapOutlined />, title: "My transactions", text: () => "Your purchases and sales" },
];

let HomeCategoriesComponent = () => {
    let [products, setProducts] = useState(undefined);

    useEffect(() => {
        getProducts();
    }, []);

    let getProducts = async () => {
        if (localStorage.getItem("apiKey") == null) {
            setProducts(null);
            return;
        }

        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products",
            {
                method: "GET",
                headers: {
                    apikey: localStorage.getItem("apiKey"),
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            setProducts(jsonData.filter(isForSale));
        } else {
            setProducts(null);
        }
    };

    if (products === undefined)
        return <Spin style={{ display: "block", marginTop: 40 }} />;

    if (products == null) {
        return (
            <div>
                <Card style={{ marginBottom: 24, textAlign: "center" }} styles={{ body: { padding: "48px 24px" } }}>
                    <img src="/logo.png" width={72} height={72} alt="" style={{ marginBottom: 16 }} />
                    <Typography.Title level={1} style={{ marginTop: 0 }}>Welcome to Wallapep</Typography.Title>
                    <Typography.Paragraph style={{ fontSize: 17, maxWidth: 640, margin: "0 auto 28px" }}>
                        {description}
                    </Typography.Paragraph>
                    <div style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: "100%" }}>
                        <Link href="/register">
                            <Button type="primary" size="large" block icon={<UserAddOutlined />}>Create an account</Button>
                        </Link>
                        <Link href="/login">
                            <Button size="large" block icon={<LoginOutlined />}>Log in</Button>
                        </Link>
                    </div>
                </Card>

                <Row gutter={[16, 16]}>
                    {features.map(f =>
                        <Col key={f.title} xs={24} md={8}>
                            <Card style={{ height: "100%" }}>
                                <Space align="start" size="middle">
                                    <span style={{ fontSize: 28, color: "#1677ff" }}>{f.icon}</span>
                                    <div>
                                        <Typography.Title level={4} style={{ marginTop: 0 }}>{f.title}</Typography.Title>
                                        <Typography.Text type="secondary">{f.text}</Typography.Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    )}
                </Row>
            </div>
        );
    }

    let counts = countByCategory(products);

    return (
        <div>
            <PageTitleComponent icon={<HomeOutlined />} title="Welcome to Wallapep" />
            <Typography.Paragraph type="secondary" style={{ fontSize: 16, marginTop: -8, marginBottom: 24 }}>
                {description}
            </Typography.Paragraph>

            <Typography.Title level={3}>What do you want to do?</Typography.Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                {shortcuts.map(s =>
                    <Col key={s.href} xs={24} sm={12} lg={6}>
                        <Link href={s.href}>
                            <Card hoverable style={{ height: "100%" }}>
                                <Space align="start" size="middle">
                                    <span style={{ fontSize: 28, color: "#1677ff" }}>{s.icon}</span>
                                    <div>
                                        <Typography.Title level={5} style={{ marginTop: 0 }}>{s.title}</Typography.Title>
                                        <Typography.Text type="secondary">{s.text(products.length)}</Typography.Text>
                                    </div>
                                </Space>
                            </Card>
                        </Link>
                    </Col>
                )}
            </Row>

            <Typography.Title level={3}>Browse by category</Typography.Title>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
                {categories.map(c =>
                    <CategoryCardComponent key={c.value} category={c} count={counts[c.value] ?? 0} />
                )}
            </div>
        </div>
    );
};

export default HomeCategoriesComponent;
