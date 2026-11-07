import { Typography } from "antd";

let PriceComponent = ({ price, size = 16, type }) => {
    return (
        <Typography.Text strong type={type} style={{ fontSize: size, whiteSpace: "nowrap" }}>
            {Number(price).toLocaleString("es-ES", { maximumFractionDigits: 2 })} €
        </Typography.Text>
    );
}

export default PriceComponent;
