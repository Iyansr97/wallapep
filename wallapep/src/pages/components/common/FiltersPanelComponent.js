import { useState, useEffect } from "react";
import { Card, Button, Space, Tag, Badge, Form } from "antd";
import { FilterOutlined, UpOutlined, DownOutlined, CloseOutlined } from "@ant-design/icons";

export const filtersColumnWidth = 215;

let FiltersPanelComponent = ({ activeFilters, onRemove, onClearAll, startCollapsed, children }) => {
    let [open, setOpen] = useState(!startCollapsed);

    useEffect(() => {
        setOpen(!startCollapsed);
    }, [startCollapsed]);

    let header =
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Badge count={open ? 0 : activeFilters.length} size="small" offset={[6, 0]}>
                <Button type="text" onClick={() => setOpen(!open)} aria-expanded={open}
                        style={{ paddingInline: 0, fontWeight: 600 }}>
                    <FilterOutlined /> Filters {open ? <UpOutlined /> : <DownOutlined />}
                </Button>
            </Badge>
            {activeFilters.length > 0 &&
                <Button type="link" size="small" icon={<CloseOutlined />} onClick={onClearAll}
                        style={{ paddingInline: 0 }}>Clear all</Button>}
        </Space>;

    return (
        <Card size="small" style={{ marginBottom: 16 }}>
            {header}
            {open &&
                <div style={{ marginTop: 8 }}>
                    {activeFilters.length > 0 &&
                        <Space wrap size={[4, 6]} style={{ marginBottom: 8 }}>
                            {activeFilters.map(f =>
                                <Tag key={f.key} closable color="blue"
                                     onClose={(e) => { e.preventDefault(); onRemove(f.key); }}>
                                    {f.text}
                                </Tag>
                            )}
                        </Space>
                    }
                    <Form layout="vertical" className="filters-form">{children}</Form>
                </div>
            }
        </Card>
    );
}

export default FiltersPanelComponent;
