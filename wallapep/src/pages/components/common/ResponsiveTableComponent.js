import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Table, Button, Descriptions } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const moreColumnWidth = 90;
const selectionColumnWidth = 48;
const safetyMargin = 16;
const defaultMinWidth = 150;

let columnWidth = (c) => typeof c.width == "number" ? c.width : (c.minWidth ?? defaultMinWidth);

let fitColumns = (columns, available, hasSelection) => {
    let fixed = columns.filter(c => c.priority == null);
    let optional = columns.filter(c => c.priority != null).sort((a, b) => a.priority - b.priority);

    let used = fixed.reduce((sum, c) => sum + columnWidth(c), 0) + (hasSelection ? selectionColumnWidth : 0)
        + safetyMargin;
    let allWidth = used + optional.reduce((sum, c) => sum + columnWidth(c), 0);
    if (allWidth <= available)
        return [];

    used += moreColumnWidth;
    let hidden = [];
    optional.forEach(c => {
        if (hidden.length == 0 && used + columnWidth(c) <= available)
            used += columnWidth(c);
        else
            hidden.push(c);
    });
    return hidden;
}

let ResponsiveTableComponent = ({ columns, rowSelection, ...props }) => {
    let containerRef = useRef(null);
    let [available, setAvailable] = useState(null);
    let [extraHidden, setExtraHidden] = useState(0);

    useEffect(() => {
        if (containerRef.current == null)
            return;
        let observer = new ResizeObserver(entries => {
            setAvailable(entries[0].contentRect.width);
            setExtraHidden(0);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    let hidden = available == null ?
        columns.filter(c => c.priority != null) :
        fitColumns(columns, available, rowSelection != null);

    let shownOptional = columns.filter(c => c.priority != null && !hidden.includes(c))
        .sort((a, b) => b.priority - a.priority);
    hidden = [...hidden, ...shownOptional.slice(0, extraHidden)];
    let visibleColumns = columns.filter(c => !hidden.includes(c));

    useLayoutEffect(() => {
        let container = containerRef.current;
        let table = container?.querySelector("table");
        if (table == null)
            return;
        let canHideMore = shownOptional.length > extraHidden;
        if (table.scrollWidth > container.clientWidth + 1 && canHideMore)
            setExtraHidden(extraHidden + 1);
    });

    let expandable = undefined;
    if (hidden.length > 0) {
        expandable = {
            expandedRowRender: (record, index) =>
                <Descriptions size="small" column={1}>
                    {hidden.map(c => {
                        let value = c.dataIndex != null ? record[c.dataIndex] : undefined;
                        return (
                            <Descriptions.Item key={c.key ?? c.dataIndex} label={c.title}>
                                {c.render ? c.render(value, record, index) : value}
                            </Descriptions.Item>
                        );
                    })}
                </Descriptions>,
            expandIconColumnIndex: visibleColumns.length + (rowSelection ? 1 : 0),
            columnWidth: moreColumnWidth,
            expandIcon: ({ expanded, onExpand, record }) =>
                <Button type="link" size="small" onClick={(e) => onExpand(record, e)}
                        icon={expanded ? <UpOutlined /> : <DownOutlined />} iconPosition="end"
                        aria-expanded={expanded}>
                    {expanded ? "Less" : "More"}
                </Button>,
        };
    }

    return (
        <div ref={containerRef}>
            <Table columns={visibleColumns} expandable={expandable}
                   rowSelection={rowSelection ? { ...rowSelection, columnWidth: selectionColumnWidth } : undefined}
                   tableLayout="fixed" {...props} />
        </div>
    );
}

export default ResponsiveTableComponent;
