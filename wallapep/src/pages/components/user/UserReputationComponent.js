import { useState, useEffect } from "react";
import { Space, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";
import { getUserPublicTransactions, summarizeUserTransactions } from "../../../utils/UtilsUsers";

let UserReputationComponent = ({ userId }) => {
    let [summary, setSummary] = useState(null);

    useEffect(() => {
        if (userId != null) {
            getUserPublicTransactions(userId).then(t => setSummary(summarizeUserTransactions(t)));
        }
    }, [userId]);

    if (summary == null)
        return null;

    return (
        <Typography.Text type="secondary">
            <Space size={4}>
                <StarFilled style={{ color: "#fadb14" }} />
                {summary.total == 0 ? "New user, no transactions yet" :
                    summary.sales + " sales · " + summary.purchases + " purchases"}
            </Space>
        </Typography.Text>
    );
}

export default UserReputationComponent;
