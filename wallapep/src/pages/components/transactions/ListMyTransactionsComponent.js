import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Typography, Row, Col, Grid, Empty } from "antd";
import {
    SwapOutlined, ShoppingCartOutlined, ShopOutlined, EuroOutlined, EyeOutlined
} from "@ant-design/icons";
import { getMyId } from "../../../utils/UtilsUsers";
import UserLinkComponent from "../user/UserLinkComponent";
import TransactionTypeTagComponent from "./TransactionTypeTagComponent";
import TransactionFiltersComponent from "./TransactionFiltersComponent";
import { filterTransactions, transactionType as typeOf } from "../../../utils/UtilsTransactions";
import CategoryTagComponent from "../products/CategoryTagComponent";
import PageTitleComponent from "../common/PageTitleComponent";
import StatisticsSummaryComponent from "../common/StatisticsSummaryComponent";
import ResponsiveTableComponent from "../common/ResponsiveTableComponent";
import { filtersColumnWidth } from "../common/FiltersPanelComponent";

let ListMyTransactionsComponent = () => {
    let [transactions, setTransactions] = useState([]);
    let [loading, setLoading] = useState(true);
    let [myId, setMyId] = useState(null);
    let [filters, setFilters] = useState({});
    let screens = Grid.useBreakpoint();

    useEffect(() => {
        setMyId(getMyId());
        getTransactions();
    }, []);

    let getTransactions = async () => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/transactions/own",
            {
                method: "GET",
                headers: {
                    apikey: localStorage.getItem("apiKey"),
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            setTransactions(jsonData.sort((a, b) => b.tid - a.tid));
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors?.forEach((e) => {
                console.log("Error: " + e.msg);
            });
        }
        setLoading(false);
    };

    let transactionType = (t) => typeOf(t, myId);
    let shownTransactions = filterTransactions(transactions, filters, myId);

    let purchases = transactions.filter(t => transactionType(t) == "purchase");
    let sales = transactions.filter(t => transactionType(t) == "sale");
    let total = (list) => list.reduce((sum, t) => sum + t.productPrice, 0);

    let columns = [
        {
            title: "",
            key: "actions",
            width: 120,
            render: (t) => <Link href={`/detailTransaction/${t.tid}`}><Button type="primary" ghost size="small" icon={<EyeOutlined />}>Details</Button></Link>,
        },
        {
            title: "Product",
            dataIndex: "title",
            sorter: (a, b) => (a.title ?? "").localeCompare(b.title ?? ""),
            minWidth: 160,
            render: (title, t) =>
                <Link href={`/detailProduct/${t.productId}`} style={{ display: "block" }}>
                    <Typography.Text ellipsis={{ tooltip: title }} style={{ width: "100%", color: "inherit" }}>{title}</Typography.Text>
                </Link>,
        },
        {
            title: "Category",
            dataIndex: "category",
            width: 130,
            priority: 4,
            render: (category) => <div className="cell-clip"><CategoryTagComponent value={category} /></div>,
        },
        {
            title: "Type",
            key: "type",
            width: 120,
            priority: 1,
            render: (t) => <TransactionTypeTagComponent type={transactionType(t)} />,
        },
        {
            title: "Buyer",
            dataIndex: "buyerId",
            width: 120,
            priority: 3,
            render: (buyerId) => <div className="cell-clip"><UserLinkComponent userId={buyerId} /></div>,
        },
        {
            title: "Seller",
            dataIndex: "sellerId",
            width: 120,
            priority: 2,
            render: (sellerId) => <div className="cell-clip"><UserLinkComponent userId={sellerId} /></div>,
        },
        {
            title: "Amount",
            dataIndex: "productPrice",
            width: 110,
            align: "right",
            sorter: (a, b) => a.productPrice - b.productPrice,
            render: (price, t) => transactionType(t) == "sale" ?
                <Typography.Text strong type="success">+{price} €</Typography.Text> :
                <Typography.Text strong type="danger">-{price} €</Typography.Text>,
        },
    ];

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <PageTitleComponent icon={<SwapOutlined />} title="My Transactions" />

            <StatisticsSummaryComponent items={[
                { title: "Purchases", value: purchases.length, icon: <ShoppingCartOutlined />, strong: true },
                { title: "Sales", value: sales.length, icon: <ShopOutlined />, strong: true },
                { title: "Spent", value: total(purchases), icon: <EuroOutlined />, precision: 2, color: "#cf1322" },
                { title: "Earned", value: total(sales), icon: <EuroOutlined />, precision: 2, color: "#3f8600", highlight: true },
            ]} />

            <Row gutter={[24, 16]} wrap={!screens.lg}>
                <Col flex={screens.lg ? filtersColumnWidth + "px" : "100%"}>
                    <TransactionFiltersComponent filters={filters} setFilters={setFilters} transactions={transactions}
                                                 myId={myId} startCollapsed={!screens.lg} />
                </Col>
                <Col flex="auto" style={{ minWidth: 0 }}>
                    <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
                        Showing {shownTransactions.length} of {transactions.length} transactions
                    </Typography.Paragraph>

                    <ResponsiveTableComponent rowKey="tid" columns={columns} dataSource={shownTransactions} loading={loading}
                           pagination={{ showTotal: (total, range) => range[0] + "-" + range[1] + " of " + total + " transactions" }}
                           locale={{ emptyText: transactions.length == 0 ?
                               <Empty description="You have no transactions yet">
                                   <Link href="/products"><Button type="primary">Browse products</Button></Link>
                               </Empty> :
                               <Empty description="No transactions match the filters">
                                   <Button type="primary" onClick={() => setFilters({})}>Clear filters</Button>
                               </Empty> }} />
                </Col>
            </Row>
        </div>
    );
};

export default ListMyTransactionsComponent;
