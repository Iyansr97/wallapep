import { Select, Space } from "antd";
import { categories } from "../../../utils/UtilsCategories";
import SelectCountLabelComponent from "../common/SelectCountLabelComponent";

let CategorySelectComponent = ({ value, onChange, size, allowClear, status, counts,
                                 placeholder = "category", style }) => {
    let options = categories.map(c => {
        let Icon = c.icon;
        return {
            value: c.value,
            label: counts ?
                <SelectCountLabelComponent icon={<Icon />} label={c.label} count={counts[c.value] ?? 0} /> :
                <Space><Icon />{c.label}</Space>,
        };
    });

    return (
        <Select placeholder={placeholder} style={{ width: "100%", ...style }}
                options={options} value={value} onChange={onChange} popupMatchSelectWidth={false}
                size={size} allowClear={allowClear} status={status} />
    );
}

export default CategorySelectComponent;
