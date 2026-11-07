import { Card, Col, Row, Statistic, Tooltip } from "antd";

let StatisticsSummaryComponent = ({ items }) => {
    let anyHighlight = items.some(item => item.highlight);

    return (
        <Row gutter={[16, 16]} align="stretch" style={{ marginBottom: 24 }}>
            {items.map(item => {
                let isText = typeof item.value == "string";
                let valueStyle =
                    item.highlight ? { fontSize: 30, fontWeight: 700, color: item.color ?? "rgba(0, 0, 0, 0.88)" } :
                    anyHighlight ? { fontSize: 20, fontWeight: item.strong ? 700 : 400,
                                     color: item.color ?? (item.strong ? "rgba(0, 0, 0, 0.88)" : "rgba(0, 0, 0, 0.55)") } :
                    { fontSize: 24, fontWeight: 600, color: item.color ?? "rgba(0, 0, 0, 0.88)" };
                return (
                    <Col key={item.title} xs={12} md={24 / Math.min(items.length, 4)}>
                        <Card size="small" style={{ height: "100%", borderColor: item.highlight ? "#91caff" : undefined }}>
                            <Statistic title={item.title} value={item.value} prefix={item.icon}
                                       suffix={item.suffix} precision={item.precision}
                                       className={isText ? "statistic-text" : undefined}
                                       valueStyle={valueStyle}
                                       formatter={isText ? (value) =>
                                           <Tooltip title={item.tooltip ?? value}>
                                               <span className="statistic-text-value">{value}</span>
                                           </Tooltip> : undefined} />
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );
}

export default StatisticsSummaryComponent;
