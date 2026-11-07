
import {useState, useEffect  } from "react";
import { Tag, Button, Typography, Modal, Row, Col, Card, Space, Tooltip, Grid, Empty } from 'antd';
import {
    AppstoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
    ShopOutlined, CheckCircleOutlined, EuroOutlined, ExclamationCircleFilled, ClearOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import DateComponent from "../common/DateComponent";
import { isForSale, productImageUrl, defaultProductImage, filterProducts } from "../../../utils/UtilsProducts";
import UserLinkComponent from "../user/UserLinkComponent";
import CategoryTagComponent from "./CategoryTagComponent";
import EditablePriceComponent from "./EditablePriceComponent";
import PageTitleComponent from "../common/PageTitleComponent";
import StatisticsSummaryComponent from "../common/StatisticsSummaryComponent";
import ProductFiltersComponent from "./ProductFiltersComponent";
import { filtersColumnWidth } from "../common/FiltersPanelComponent";
import ResponsiveTableComponent from "../common/ResponsiveTableComponent";

let ListMyProductsComponent = ({ openNotification }) => {
    let [products, setProducts] = useState([])
    let [filters, setFilters] = useState({})
    let [loading, setLoading] = useState(true)
    let [lastUpdatedId, setLastUpdatedId] = useState(null)
    let [selectedIds, setSelectedIds] = useState([])
    let [modal, contextHolder] = Modal.useModal()
    let router = useRouter()
    let screens = Grid.useBreakpoint()

    useEffect(() => {
        getMyProducts();
    }, [])

    let deleteProduct = async (id) => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "DELETE",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            return jsonData.deleted == true
        }
        return false
    }

    let deleteSelected = async () => {
        let ids = [...selectedIds]
        let results = await Promise.all(ids.map(id => deleteProduct(id)))
        let deletedIds = ids.filter((id, i) => results[i])

        setProducts(products.filter(p => !deletedIds.includes(p.id)))
        setSelectedIds([])

        if (deletedIds.length == ids.length) {
            openNotification?.("top", deletedIds.length == 1 ? "Product deleted" : deletedIds.length + " products deleted", "success")
        } else {
            openNotification?.("top", (ids.length - deletedIds.length) + " of " + ids.length + " products could not be deleted", "error")
        }
    }

    let confirmDelete = () => {
        let selected = products.filter(p => selectedIds.includes(p.id))
        let n = selected.length
        modal.confirm({
            title: n == 1 ? "Delete 1 product?" : "Delete " + n + " products?",
            icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
            content:
                <div>
                    <Typography.Paragraph>
                        Are you sure you want to delete {n == 1 ? "this product" : "these " + n + " products"}? This cannot be undone.
                    </Typography.Paragraph>
                    <ul style={{ paddingLeft: 20, maxHeight: 160, overflowY: "auto" }}>
                        {selected.map(p => <li key={p.id}>{p.title}</li>)}
                    </ul>
                </div>,
            okText: n == 1 ? "Delete" : "Delete " + n,
            okButtonProps: { danger: true },
            cancelText: "Cancel",
            onOk: deleteSelected,
        })
    }

    let getMyProducts = async () => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/products/own/",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            jsonData.map( product => {
                product.key = product.id
                return product
            })
            setProducts(jsonData.sort((a, b) => b.date - a.date))
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
        setLoading(false)
    }

    let onPriceSaved = (modified) => {
        setProducts(products.map(p => p.id == modified.id ? { ...p, price: modified.price } : p))
        setLastUpdatedId(modified.id)
    }

    let shownProducts = filterProducts(products, filters)
    let soldProducts = products.filter(p => !isForSale(p))
    let earned = soldProducts.reduce((sum, p) => sum + p.price, 0)

    let columns = [
        {
            title: "",
            dataIndex: "id",
            key: "image",
            width: 64,
            priority: 2,
            render: (id) => <img src={productImageUrl(id)} width={48} height={48}
                                 style={{ objectFit: "contain", borderRadius: 6, backgroundColor: "#f5f5f5" }}
                                 onError={(e) => { e.currentTarget.src = defaultProductImage }} />
        },
        {
            title: "Title",
            dataIndex: "title",
            width: 180,
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (title, product) =>
                <Link href={"/detailProduct/" + product.id} style={{ display: "block" }}>
                    <Typography.Text ellipsis={{ tooltip: title }} style={{ width: "100%", color: "inherit" }}>{title}</Typography.Text>
                </Link>
        },
        {
            title: "Category",
            dataIndex: "category",
            width: 150,
            priority: 5,
            render: (category) => <CategoryTagComponent value={category} />
        },
        {
            title: "Price",
            dataIndex: "price",
            width: 110,
            align: "right",
            sorter: (a, b) => a.price - b.price,
            render: (price, product) =>
                <EditablePriceComponent key={product.id + "-" + price} product={product}
                                        editable={isForSale(product)} onSaved={onPriceSaved}
                                        highlight={product.id == lastUpdatedId}
                                        openNotification={openNotification} />
        },
        {
            title: "Status",
            key: "status",
            width: 110,
            priority: 1,
            render: (product) => isForSale(product) ?
                <Tag color="green" icon={<ShopOutlined />}>For sale</Tag> :
                <Tag icon={<CheckCircleOutlined />}>Sold</Tag>
        },
        {
            title: "Published",
            dataIndex: "date",
            width: 130,
            priority: 3,
            sorter: (a, b) => a.date - b.date,
            render: (date) => <DateComponent timestamp={date} />
        },
        {
            title: "Buyer",
            dataIndex: "buyerId",
            width: 150,
            priority: 4,
            render: (buyerId) => <div className="cell-clip"><UserLinkComponent userId={ buyerId } /></div>
        },
    ]

    return (
        <div>
            <PageTitleComponent icon={<AppstoreOutlined />} title="My Products" />

            <StatisticsSummaryComponent items={[
                { title: "Published", value: products.length, icon: <AppstoreOutlined />, strong: true },
                { title: "For sale", value: products.length - soldProducts.length, icon: <ShopOutlined />, strong: true },
                { title: "Sold", value: soldProducts.length, icon: <CheckCircleOutlined />, strong: true },
                { title: "Earned", value: earned, icon: <EuroOutlined />, precision: 2, color: "#3f8600", highlight: true },
            ]} />

            <Row gutter={[24, 16]} wrap={!screens.lg}>
                <Col flex={screens.lg ? filtersColumnWidth + "px" : "100%"}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                        <Space direction={screens.lg ? "vertical" : "horizontal"} wrap style={{ width: "100%" }}>
                            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                                {selectedIds.length == 0 ? "No product selected" :
                                    selectedIds.length == 1 ? "1 product selected" : selectedIds.length + " products selected"}
                            </Typography.Text>
                            <Button type="primary" block icon={<PlusOutlined />}
                                    onClick={() => router.push("/createProduct")}>Create</Button>
                            <Tooltip title={selectedIds.length != 1 ? "Select one product to edit it" : undefined} placement="right">
                                <Button block icon={<EditOutlined />} disabled={selectedIds.length != 1}
                                        onClick={() => router.push("/editProduct/" + selectedIds[0])}>Edit</Button>
                            </Tooltip>
                            <Tooltip title={selectedIds.length == 0 ? "Select one or more products to delete them" : undefined} placement="right">
                                <Button block danger icon={<DeleteOutlined />} disabled={selectedIds.length == 0}
                                        onClick={confirmDelete}>
                                    {selectedIds.length > 1 ? "Delete " + selectedIds.length : "Delete"}
                                </Button>
                            </Tooltip>
                            <Button block icon={<ClearOutlined />} disabled={selectedIds.length == 0}
                                    onClick={() => setSelectedIds([])}>Clear</Button>
                        </Space>
                    </Card>
                    <ProductFiltersComponent filters={filters} setFilters={setFilters} showStatus
                                             products={products} startCollapsed={!screens.lg} />
                </Col>
                <Col flex="auto" style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                        <Typography.Text type="secondary">
                            Showing {shownProducts.length} of {products.length} products
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                            <span className="legend-sold" /> Sold products (grey background) cannot be edited or deleted.
                        </Typography.Text>
                    </div>
                    <ResponsiveTableComponent columns={columns} dataSource={shownProducts} loading={loading}
                           rowClassName={(product) => isForSale(product) ? "" : "row-sold"}
                           rowSelection={{
                               selectedRowKeys: selectedIds,
                               onChange: (keys) => setSelectedIds(keys),
                               getCheckboxProps: (product) => ({ disabled: !isForSale(product) }),
                           }}
                           pagination={{ showTotal: (total, range) => range[0] + "-" + range[1] + " of " + total + " products" }}
                           locale={{ emptyText: products.length == 0 ?
                               <Empty description="You have not published any product yet">
                                   <Link href="/createProduct"><Button type="primary">Sell a product</Button></Link>
                               </Empty> :
                               <Empty description="No products match the filters">
                                   <Button type="primary" onClick={() => setFilters({})}>Clear filters</Button>
                               </Empty> }} />
                </Col>
            </Row>
            {contextHolder}
        </div>
    )
}

export default ListMyProductsComponent;
