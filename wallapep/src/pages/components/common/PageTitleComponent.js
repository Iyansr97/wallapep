import { Typography, Space } from "antd";

let PageTitleComponent = ({ icon, title, extra, center, level = 2 }) => {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center",
                      justifyContent: center ? "center" : "space-between", gap: 12, marginBottom: center ? 12 : 20 }}>
            <Typography.Title level={level} style={{ margin: 0 }}>
                <Space>{icon}{title}</Space>
            </Typography.Title>
            {extra}
        </div>
    );
}

export default PageTitleComponent;
