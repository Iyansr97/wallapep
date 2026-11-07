import "@/styles/globals.css";
import Link from "next/link";
import Head from "next/head";
import 'antd/dist/reset.css';
import { Layout, Menu, Col, Row, notification, Dropdown, Breadcrumb, Space, Button, ConfigProvider } from 'antd';
import {
    LoginOutlined, UserAddOutlined, ShopOutlined, PlusOutlined, AppstoreOutlined,
    SwapOutlined, LogoutOutlined, UserOutlined, HomeOutlined, DownOutlined
} from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import store from "../reducers/store"
import { UserAvatarComponent } from "./components/user/UserLinkComponent";

const products = { title: "Products", href: "/products" };
const myProducts = { title: "My Products", href: "/myProducts" };
const myTransactions = { title: "My Transactions", href: "/myTransactions" };

const sections = [
    { path: "/products", menuKey: "menuProducts", title: "Products", parents: [] },
    { path: "/detailProduct", menuKey: "menuProducts", title: "Product", parents: [products] },
    { path: "/createProduct", menuKey: "menuCreateProduct", title: "Sell a product", parents: [] },
    { path: "/myProducts", menuKey: "menuMyProduct", title: "My Products", parents: [] },
    { path: "/editProduct", menuKey: "menuMyProduct", title: "Edit product", parents: [myProducts] },
    { path: "/myTransactions", menuKey: "menuMyTransactions", title: "My Transactions", parents: [] },
    { path: "/detailTransaction", menuKey: "menuMyTransactions", title: "Transaction", parents: [myTransactions] },
    { path: "/user", menuKey: null, title: "User profile", parents: [] },
    { path: "/login", menuKey: "menuLogin", title: "Login", parents: [] },
    { path: "/register", menuKey: "menuRegister", title: "Register", parents: [] },
];

const theme = {
    components: {
        Card: { colorBorderSecondary: "#d9d9d9" },
    },
};

const notificationTitles = { success: "Done", error: "Something went wrong", info: "Information", warning: "Warning" };

export default function App({ Component, pageProps }) {
    const [api, contextHolder] = notification.useNotification();

    const pathname = usePathname();
    let router = useRouter()
    let [login, setLogin] = useState(false);
    let [email, setEmail] = useState(null)
    let [myId, setMyId] = useState(null)

    useEffect(() => {
        checkAll();
    }, [])

    useEffect(() => {
        setEmail(localStorage.getItem("email"))
        setMyId(localStorage.getItem("id"))
    }, [login])

    let checkAll = async () => {
        let isActive = await checkLoginIsActive()
        checkUserAccess(isActive)
    }

    let checkUserAccess= async (isActive) => {
        if (!isActive && !["/", "/login", "/register"].includes(pathname)) {
            router.push("/login");
        }
    }

    let checkLoginIsActive = async () => {
        if(localStorage.getItem("apiKey") == null){
            setLogin(false);
            return false;
        }

        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/isActiveApiKey",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        if (response.ok) {
            let jsonData = await response.json();
            setLogin(jsonData.activeApiKey)
            return(jsonData.activeApiKey)
        } else {
            setLogin(false)
            return (false)
        }
    }

    let disconnect = async (e) => {
        e?.domEvent?.preventDefault();
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL +"/users/disconnect",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        localStorage.removeItem("apiKey");
        localStorage.removeItem("id");
        setLogin(false)
        router.push("/")
    }

  let { Header, Content, Footer } = Layout;

  const openNotification = (placement, text, type) => {
        api[type]({
            message: notificationTitles[type] ?? "Notification",
            description: text,
            placement,
        });
    };

  let currentSection = pathname == "/" ?
      { menuKey: null, title: "Home", parents: [] } :
      sections.find(s => pathname?.startsWith(s.path));
  let pageTitle = currentSection ? currentSection.title + " | Wallapep" : "Wallapep";

  let breadcrumbItems = pathname == "/" ?
      [{ title: <Space size={4}><HomeOutlined />Home</Space> }] :
      currentSection ? [
          { title: <Link href="/"><Space size={4}><HomeOutlined />Home</Space></Link> },
          ...currentSection.parents.map(p => ({ title: <Link href={p.href}>{p.title}</Link> })),
          { title: currentSection.title },
      ] : null;

  let logo = { key:"logo",  label: <Link href="/"><img src="/logo.png" width="40" height="40" alt="Wallapep home" /></Link>};

  let userMenuItems = [
      { key: "profile", icon: <UserOutlined />, label: <Link href={"/user/" + myId}>My profile</Link> },
      { type: "divider" },
      { key: "disconnect", icon: <LogoutOutlined />, label: "Disconnect", danger: true, onClick: disconnect },
  ];

  return (
    <Provider store={store}>
    <ConfigProvider theme={theme}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        {contextHolder}
          <Header style={{ paddingInline: 16, position: "sticky", top: 0, zIndex: 100, width: "100%" }}>
            <Row wrap={false}>
                <Col flex="auto" style={{ minWidth: 0 }}>
                {!login &&
                    <Menu theme="dark" mode="horizontal" selectedKeys={[currentSection?.menuKey]} items={ [
                        logo,
                        { key:"menuLogin",  icon: <LoginOutlined/>, label: <Link href="/login">Login</Link>},
                        { key:"menuRegister", icon: <UserAddOutlined/>, label: <Link href="/register">Register</Link>},
                    ]} >
                    </Menu>
                }
                {login &&
                    <Menu theme="dark" mode="horizontal" selectedKeys={[currentSection?.menuKey]} items={ [
                        logo,
                        { key:"menuProducts", icon: <ShopOutlined/>, label: <Link href="/products">Products</Link>},
                        { key:"menuCreateProduct", icon: <PlusOutlined/>, label: <Link href="/createProduct">Sell</Link>},
                        { key:"menuMyProduct", icon: <AppstoreOutlined/>, label: <Link href="/myProducts">My Products</Link> },
                        { key:"menuMyTransactions", icon: <SwapOutlined/>, label: <Link href="/myTransactions">My Transactions</Link> },
                    ]} >
                    </Menu>
                }
                </Col>
                <Col flex="none" style={{ display: 'flex', alignItems: 'center', height: 64, paddingLeft: 12 }} >
                    { login ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                            <Button type="text" aria-label="User menu"
                                    style={{ height: 48, padding: "0 6px", display: "flex", alignItems: "center", lineHeight: 1 }}>
                                <Space align="center">
                                    <UserAvatarComponent user={{ email: email }} userId={ myId } size="large" />
                                    <DownOutlined style={{ color: "#ffffff" }} />
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Link href ="/login"><Button type="primary" icon={<LoginOutlined />} style={{ minWidth: 130 }}>Login</Button></Link>
                    )}
                </Col>
            </Row>
          </Header>
          <Content className="page-content">
              {breadcrumbItems && <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />}
              <Component {...pageProps} setLogin={setLogin} openNotification={openNotification} />
          </Content>
          <Footer style={{ textAlign: "center" }}> Wallapep · second-hand marketplace </Footer>
      </Layout>
    </ConfigProvider>
    </Provider>
  )
}
