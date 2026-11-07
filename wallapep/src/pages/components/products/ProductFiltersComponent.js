import { Input, InputNumber, Select } from "antd";
import { ShopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { modifyStateProperty } from "../../../utils/UtilsState";
import { categoryLabel, countByCategory } from "../../../utils/UtilsCategories";
import { filterProducts, isForSale } from "../../../utils/UtilsProducts";
import CategorySelectComponent from "./CategorySelectComponent";
import FormFieldComponent from "../common/FormFieldComponent";
import FiltersPanelComponent from "../common/FiltersPanelComponent";
import SelectCountLabelComponent from "../common/SelectCountLabelComponent";

let ProductFiltersComponent = ({ filters, setFilters, products, showStatus, startCollapsed }) => {
    let set = (key, value) => modifyStateProperty(filters, setFilters, key, value);

    let productsWithout = (key) => filterProducts(products, { ...filters, [key]: null });
    let forStatus = productsWithout("status");
    let forSaleCount = forStatus.filter(isForSale).length;
    let statusOptions = [
        { value: "sale", label: <SelectCountLabelComponent icon={<ShopOutlined />} label="For sale" count={forSaleCount} /> },
        { value: "sold", label: <SelectCountLabelComponent icon={<CheckCircleOutlined />} label="Sold"
                                                           count={forStatus.length - forSaleCount} /> },
    ];

    let activeFilters = [
        filters.title && { key: "title", text: "\"" + filters.title + "\"" },
        filters.category && { key: "category", text: categoryLabel(filters.category) },
        filters.status && { key: "status", text: filters.status == "sale" ? "For sale" : "Sold" },
        filters.minPrice != null && { key: "minPrice", text: "From " + filters.minPrice + " €" },
        filters.maxPrice != null && { key: "maxPrice", text: "Up to " + filters.maxPrice + " €" },
    ].filter(f => f);

    return (
        <FiltersPanelComponent activeFilters={activeFilters} onRemove={(key) => set(key, null)}
                               onClearAll={() => setFilters({})} startCollapsed={startCollapsed}>
            <FormFieldComponent label="Title">
                <Input.Search placeholder="Search" allowClear enterButton value={filters.title}
                              onChange={(i) => set("title", i.currentTarget.value)}
                              onSearch={(value) => set("title", value)} />
            </FormFieldComponent>

            <FormFieldComponent label="Category">
                <CategorySelectComponent allowClear placeholder="All" counts={countByCategory(productsWithout("category"))}
                                         value={filters.category} onChange={(value) => set("category", value)} />
            </FormFieldComponent>

            {showStatus &&
                <FormFieldComponent label="Status">
                    <Select placeholder="All" allowClear style={{ width: "100%" }}
                            options={statusOptions} value={filters.status}
                            onChange={(value) => set("status", value)} />
                </FormFieldComponent>}

            <FormFieldComponent label="Min price">
                <InputNumber placeholder="0" min={0} style={{ width: "100%" }} addonAfter="€"
                             value={filters.minPrice} onChange={(value) => set("minPrice", value)} />
            </FormFieldComponent>

            <FormFieldComponent label="Max price">
                <InputNumber placeholder="any" min={0} style={{ width: "100%" }} addonAfter="€"
                             value={filters.maxPrice} onChange={(value) => set("maxPrice", value)} />
            </FormFieldComponent>
        </FiltersPanelComponent>
    );
}

export default ProductFiltersComponent;
