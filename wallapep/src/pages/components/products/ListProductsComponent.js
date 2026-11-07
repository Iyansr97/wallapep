import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row, Button, Empty, Typography, Select, Pagination, Space, Grid } from 'antd';
import { ShopOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { filterProducts, isForSale, sortProducts, productSortOptions, getViewedProducts } from "../../../utils/UtilsProducts";
import { categories, countByCategory } from "../../../utils/UtilsCategories";
import ProductCardComponent from "./ProductCardComponent";
import ProductFiltersComponent from "./ProductFiltersComponent";
import CategoryTagComponent from "./CategoryTagComponent";
import BuyProductModalComponent from "./BuyProductModalComponent";
import PageTitleComponent from "../common/PageTitleComponent";
import { filtersColumnWidth } from "../common/FiltersPanelComponent";

const pageSize = 12;

let ListProductsComponent = ({ openNotification }) => {
  let [products, setProducts] = useState([]);
  let [myProductIds, setMyProductIds] = useState([]);
  let [viewedIds, setViewedIds] = useState([]);
  let [filters, setFilters] = useState({});
  let [sort, setSort] = useState("newest");
  let [page, setPage] = useState(1);
  let [productToBuy, setProductToBuy] = useState(null);
  let router = useRouter();
  let screens = Grid.useBreakpoint();

  useEffect(() => {
    if (router.isReady && router.query.category) {
      setFilters({ category: router.query.category });
    }
  }, [router.isReady, router.query.category]);

  useEffect(() => {
    getProducts();
    getMyProductIds();
    setViewedIds(getViewedProducts());
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  let getProducts = async () => {
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
      setProducts(jsonData.filter(isForSale))
    } else {
      let responseBody = await response.json();
      let serverErrors = responseBody.errors;
      serverErrors.forEach((e) => {
        console.log("Error: " + e.msg);
      });
    }
  };

  let getMyProductIds = async () => {
    let response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products/own",
      {
        method: "GET",
        headers: {
          apikey: localStorage.getItem("apiKey"),
        },
      }
    );
    if (response.ok) {
      setMyProductIds((await response.json()).map(p => p.id));
    }
  };

  let onBought = (product) => {
    setProducts(products.filter(p => p.id != product.id));
    setProductToBuy(null);
  };

  let counts = countByCategory(products);
  let shownProducts = sortProducts(filterProducts(products, filters), sort);
  let pageProducts = shownProducts.slice((page - 1) * pageSize, page * pageSize);
  let hasFilters = Object.values(filters).some(v => v != null && v !== "");

  return (
    <div>
      <PageTitleComponent icon={<ShopOutlined />} title="Products" />

      <Row gutter={[24, 16]} wrap={!screens.lg}>
        <Col flex={screens.lg ? filtersColumnWidth + "px" : "100%"}>
          <ProductFiltersComponent filters={filters} setFilters={setFilters} products={products}
                                   startCollapsed={!screens.lg} />
        </Col>
        <Col flex="auto" style={{ minWidth: 0 }}>
            <Row justify="space-between" align="middle" gutter={[12, 12]} style={{ marginBottom: 16 }}>
              <Col>
                <Typography.Text type="secondary">
                  {shownProducts.length} of {products.length} products for sale
                </Typography.Text>
              </Col>
              <Col>
                <Space>
                  <Typography.Text><SortAscendingOutlined /> Sort by</Typography.Text>
                  <Select value={sort} onChange={setSort} style={{ width: 180 }} aria-label="Sort by"
                          options={productSortOptions.map(o => ({ value: o.value, label: o.label }))} />
                </Space>
              </Col>
            </Row>

            {shownProducts.length == 0 ?
              <Empty description="No products match the search">
                <Space direction="vertical" align="center">
                  {hasFilters && <Button type="primary" onClick={() => setFilters({})}>Clear filters</Button>}
                  <Typography.Text type="secondary">Or try one of these categories:</Typography.Text>
                  <Space wrap style={{ justifyContent: "center" }}>
                    {categories.filter(c => counts[c.value] > 0).map(c =>
                      <a key={c.value} onClick={() => setFilters({ category: c.value })}>
                        <CategoryTagComponent value={c.value} count={counts[c.value]} />
                      </a>
                    )}
                  </Space>
                </Space>
              </Empty> :
              <>
                <Row gutter={ [16, 16] } >
                      { pageProducts.map( p =>
                          <Col key={p.id} xs={24} sm={12} md={8} lg={8} xxl={6} >
                             <ProductCardComponent product={p}
                                onBuy={setProductToBuy} isMine={myProductIds.includes(p.id)}
                                viewed={viewedIds.includes(p.id)} />
                          </Col>
                       )}
                </Row>
                <Pagination style={{ marginTop: 24, textAlign: "center", justifyContent: "center" }}
                            current={page} pageSize={pageSize} total={shownProducts.length}
                            onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            hideOnSinglePage showSizeChanger={false} />
              </>
            }
        </Col>
      </Row>

      <BuyProductModalComponent product={productToBuy} open={productToBuy != null}
                                onClose={() => setProductToBuy(null)} onBought={onBought}
                                openNotification={openNotification} />
    </div>
  );
};

export default ListProductsComponent;
