import { Tag } from "antd";
import { findCategory } from "../../../utils/UtilsCategories";

let CategoryTagComponent = ({ value, count }) => {
    let category = findCategory(value);
    let Icon = category.icon;
    return (
        <Tag color={category.color} icon={<Icon />} style={{ marginInlineEnd: 0 }}>
            {category.label}{count != null && " (" + count + ")"}
        </Tag>
    );
}

export default CategoryTagComponent;
