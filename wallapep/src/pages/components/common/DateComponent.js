import { Tooltip, Space } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { timestampToString, timestampToTimeAgo } from "../../../utils/UtilsDates";

let DateComponent = ({ timestamp, icon = true }) => {
    if (!timestamp)
        return "-";
    return (
        <Tooltip title={timestampToString(timestamp)}>
            <Space size={4} style={{ whiteSpace: "nowrap" }}>
                {icon && <CalendarOutlined />}
                {timestampToTimeAgo(timestamp)}
            </Space>
        </Tooltip>
    );
}

export default DateComponent;
