import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Col, Row, Empty, Result, Spin, Typography, Space, Tabs, Badge, Grid } from "antd";
import {
    MailOutlined, EnvironmentOutlined, ShopOutlined, ShoppingCartOutlined,
    AppstoreOutlined, HistoryOutlined
} from "@ant-design/icons";
import { isForSale, filterProducts } from "../../../utils/UtilsProducts";
import { filterTransactions } from "../../../utils/UtilsTransactions";
import { timestampToTimeAgo, timestampToString } from "../../../utils/UtilsDates";
import {
    getPublicUser, userDisplayName, getUserPublicTransactions, summarizeUserTransactions, getMyId
} from "../../../utils/UtilsUsers";
import UserLinkComponent, { UserAvatarComponent } from "./UserLinkComponent";
import ProductCardComponent from "../products/ProductCardComponent";
import CategoryTagComponent from "../products/CategoryTagComponent";
import ProductFiltersComponent from "../products/ProductFiltersComponent";
import TransactionFiltersComponent from "../transactions/TransactionFiltersComponent";
import StatisticsSummaryComponent from "../common/StatisticsSummaryComponent";
import ResponsiveTableComponent from "../common/ResponsiveTableComponent";
import PriceComponent from "../common/PriceComponent";
import { filtersColumnWidth } from "../common/FiltersPanelComponent";

let UserProfileComponent = ({ id }) => {
    let [user, setUser] = useState(undefined);
    let [products, setProducts] = useState([]);
    let [lastActivity, setLastActivity] = useState(null);
    let [transactions, setTransactions] = useState([]);
    let [loadingTransactions, setLoadingTransactions] = useState(true);
    let [myId, setMyId] = useState(null);
    let router = useRouter();
    let [activeTab, setActiveTab] = useState("products");
    let [productsById, setProductsById] = useState({});
    let [productFilters, setProductFilters] = useState({});
    let [salesFilters, setSalesFilters] = useState({});
    let [purchasesFilters, setPurchasesFilters] = useState({});
    let screens = Grid.useBreakpoint();

    useEffect(() => {
        if (router.isReady && ["products", "sales", "purchases"].includes(router.query.tab)) {
            setActiveTab(router.query.tab);
        }
    }, [router.isReady, router.query.tab]);

    useEffect(() => {
        setMyId(getMyId());
    }, []);

    useEffect(() => {
        if (id != undefined) {
            getPublicUser(id).then(setUser);
            getProducts();
            getProductsById();
            getUserPublicTransactions(id).then(t => {
                setTransactions(t);
                setLoadingTransactions(false);
            });
        }
    }, [id]);

    let getProducts = async () => {
        let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products?sellerId=" + id, {
            method: "GET",
            headers: {
                apikey: localStorage.getItem("apiKey"),
            },
        });
        if (response.ok) {
            let jsonData = await response.json();
            setProducts(jsonData.filter(isForSale));
            setLastActivity(jsonData.length > 0 ? Math.max(...jsonData.map(p => p.date)) : null);
        }
    };

    let getProductsById = async () => {
        let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products", {
            method: "GET",
            headers: {
                apikey: localStorage.getItem("apiKey"),
            },
        });
        if (response.ok) {
            let jsonData = await response.json();
            setProductsById(Object.fromEntries(jsonData.map(p => [p.id, p])));
        }
    };

    let summary = summarizeUserTransactions(transactions);

    let detailedTransactions = transactions.map(t => ({
        ...t,
        category: productsById[t.productId]?.category,
        productPrice: productsById[t.productId]?.price,
    }));

    let transactionColumns = (otherPart) => [
        {
            title: "Product",
            dataIndex: "title",
            width: "35%",
            minWidth: 160,
            sorter: (a, b) => (a.title ?? "").localeCompare(b.title ?? ""),
            render: (title, t) =>
                <Link href={`/detailProduct/${t.productId}`} style={{ display: "block" }}>
                    <Typography.Text ellipsis={{ tooltip: title }} style={{ width: "100%", color: "inherit" }}>{title}</Typography.Text>
                </Link>,
        },
        {
            title: "Category",
            dataIndex: "category",
            width: "25%",
            minWidth: 130,
            priority: 2,
            render: (category) => <div className="cell-clip"><CategoryTagComponent value={category} /></div>,
        },
        {
            title: "Price",
            dataIndex: "productPrice",
            width: "15%",
            minWidth: 110,
            align: "right",
            sorter: (a, b) => (a.productPrice ?? 0) - (b.productPrice ?? 0),
            render: (price) => <div className="cell-clip">{price != null ? <PriceComponent price={price} /> : "-"}</div>,
        },
        otherPart == "buyer" ?
            {
                title: "Buyer",
                dataIndex: "buyerId",
                width: "25%",
                minWidth: 130,
                priority: 1,
                render: (buyerId) => <div className="cell-clip"><UserLinkComponent userId={buyerId} /></div>,
            } :
            {
                title: "Seller",
                dataIndex: "sellerId",
                width: "25%",
                minWidth: 130,
                priority: 1,
                render: (sellerId) => <div className="cell-clip"><UserLinkComponent userId={sellerId} /></div>,
            },
    ];

    let filteredTab = (filtersPanel, shown, total, list) =>
        <Row gutter={[24, 16]} wrap={!screens.lg}>
            <Col flex={screens.lg ? filtersColumnWidth + "px" : "100%"}>{filtersPanel}</Col>
            <Col flex="auto" style={{ minWidth: 0 }}>
                <Typography.Paragraph type="secondary">Showing {shown} of {total}</Typography.Paragraph>
                {list}
            </Col>
        </Row>;

    let noMatches = (description, clearFilters) =>
        <Empty description={description}>
            <Button type="primary" onClick={() => clearFilters({})}>Clear filters</Button>
        </Empty>;

    let productsTab = () => {
        if (products.length == 0)
            return <Empty description="This user has no products for sale" />;

        let shownProducts = filterProducts(products, productFilters);
        return filteredTab(
            <ProductFiltersComponent filters={productFilters} setFilters={setProductFilters}
                                     products={products} startCollapsed={!screens.lg} />,
            shownProducts.length, products.length,
            shownProducts.length == 0 ? noMatches("No products match the filters", setProductFilters) :
                <Row gutter={[16, 16]}>
                    {shownProducts.map(p =>
                        <Col key={p.id} xs={24} sm={12} md={8} lg={8} xxl={6}>
                            <ProductCardComponent product={p} isMine={myId != null && id == myId} />
                        </Col>
                    )}
                </Row>
        );
    };

    let transactionsTab = (type, otherPart, emptyText, filters, setFilters) => {
        let typeTransactions = detailedTransactions.filter(t => t.type == type);
        let table = (dataSource, empty) =>
            <ResponsiveTableComponent rowKey="id" columns={transactionColumns(otherPart)} dataSource={dataSource}
                                      loading={loadingTransactions} locale={{ emptyText: empty }} />;

        if (typeTransactions.length == 0)
            return table([], <Empty description={emptyText} />);

        let shownTransactions = filterTransactions(typeTransactions, filters);
        return filteredTab(
            <TransactionFiltersComponent filters={filters} setFilters={setFilters} hideType
                                         transactions={typeTransactions}
                                         startCollapsed={!screens.lg} />,
            shownTransactions.length, typeTransactions.length,
            table(shownTransactions, noMatches("No transactions match the filters", setFilters))
        );
    };

    let tabLabel = (icon, text, count) =>
        <Space size={6}>{icon}{text}<Badge count={count} showZero color="#8c8c8c" /></Space>;

    if (user === undefined)
        return <Spin style={{ display: "block", marginTop: 40 }} />;

    if (user == null)
        return <Result status="404" title="User not found" />;

    return (
        <div>
            <Card style={{ width: "fit-content", maxWidth: "100%", margin: "0 auto 24px", textAlign: "center" }}>
                <UserAvatarComponent user={user} userId={user.id} size={88} />
                <Typography.Title level={2} style={{ margin: "12px 0 12px", overflowWrap: "anywhere" }}>
                    {userDisplayName(user)}
                </Typography.Title>
                <Space size={[20, 8]} wrap style={{ justifyContent: "center" }}>
                    {[
                        { icon: <MailOutlined />, label: "Email", value: user.email },
                        { icon: <EnvironmentOutlined />, label: "Country", value: user.country },
                        { icon: <EnvironmentOutlined />, label: "Postal code", value: user.postalCode },
                    ].map(item =>
                        <Space key={item.label} size={6}>
                            <Typography.Text type="secondary">{item.icon} {item.label}:</Typography.Text>
                            <Typography.Text>{item.value || "-"}</Typography.Text>
                        </Space>
                    )}
                </Space>
            </Card>

            <StatisticsSummaryComponent items={[
                { title: "Sales", value: summary.sales, icon: <ShopOutlined /> },
                { title: "Purchases", value: summary.purchases, icon: <ShoppingCartOutlined /> },
                { title: "Products for sale", value: products.length, icon: <AppstoreOutlined /> },
                { title: "Last activity", value: lastActivity ? timestampToTimeAgo(lastActivity) : "No activity", icon: <HistoryOutlined />,
                  tooltip: lastActivity ? "Last product published on " + timestampToString(lastActivity) : undefined },
            ]} />

            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
                    {
                        key: "products",
                        label: tabLabel(<AppstoreOutlined />, "Products for sale", products.length),
                        children: productsTab(),
                    },
                    {
                        key: "sales",
                        label: tabLabel(<ShopOutlined />, "Sales", summary.sales),
                        children: transactionsTab("sale", "buyer", "This user has not sold anything yet",
                                                   salesFilters, setSalesFilters),
                    },
                    {
                        key: "purchases",
                        label: tabLabel(<ShoppingCartOutlined />, "Purchases", summary.purchases),
                        children: transactionsTab("purchase", "seller", "This user has not bought anything yet",
                                                   purchasesFilters, setPurchasesFilters),
                    },
                ]} />
            </Card>
        </div>
    );
};

export default UserProfileComponent;
