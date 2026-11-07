import { Input, InputNumber, Select } from "antd";
import { ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";
import { modifyStateProperty } from "../../../utils/UtilsState";
import { categoryLabel, countByCategory } from "../../../utils/UtilsCategories";
import { filterTransactions, transactionType } from "../../../utils/UtilsTransactions";
import CategorySelectComponent from "../products/CategorySelectComponent";
import FormFieldComponent from "../common/FormFieldComponent";
import FiltersPanelComponent from "../common/FiltersPanelComponent";
import SelectCountLabelComponent from "../common/SelectCountLabelComponent";

let TransactionFiltersComponent = ({ filters, setFilters, transactions, myId, startCollapsed, hideType }) => {
    let set = (key, value) => modifyStateProperty(filters, setFilters, key, value);

    let transactionsWithout = (key) => filterTransactions(transactions, { ...filters, [key]: null }, myId);
    let forType = transactionsWithout("type");
    let purchasesCount = forType.filter(t => transactionType(t, myId) == "purchase").length;
    let typeOptions = [
        { value: "purchase", label: <SelectCountLabelComponent icon={<ShoppingCartOutlined />} label="Purchases" count={purchasesCount} /> },
        { value: "sale", label: <SelectCountLabelComponent icon={<ShopOutlined />} label="Sales"
                                                           count={forType.length - purchasesCount} /> },
    ];

    let activeFilters = [
        filters.title && { key: "title", text: "\"" + filters.title + "\"" },
        filters.type && { key: "type", text: filters.type == "purchase" ? "Purchases" : "Sales" },
        filters.category && { key: "category", text: categoryLabel(filters.category) },
        filters.minAmount != null && { key: "minAmount", text: "From " + filters.minAmount + " €" },
        filters.maxAmount != null && { key: "maxAmount", text: "Up to " + filters.maxAmount + " €" },
    ].filter(f => f);

    return (
        <FiltersPanelComponent activeFilters={activeFilters} onRemove={(key) => set(key, null)}
                               onClearAll={() => setFilters({})} startCollapsed={startCollapsed}>
            <FormFieldComponent label="Product">
                <Input.Search placeholder="Search" allowClear enterButton value={filters.title}
                              onChange={(i) => set("title", i.currentTarget.value)}
                              onSearch={(value) => set("title", value)} />
            </FormFieldComponent>

            {!hideType &&
                <FormFieldComponent label="Type">
                    <Select placeholder="All" allowClear style={{ width: "100%" }}
                            options={typeOptions} value={filters.type}
                            onChange={(value) => set("type", value)} />
                </FormFieldComponent>}

            <FormFieldComponent label="Category">
                <CategorySelectComponent allowClear placeholder="All" counts={countByCategory(transactionsWithout("category"))}
                                         value={filters.category} onChange={(value) => set("category", value)} />
            </FormFieldComponent>

            <FormFieldComponent label="Min amount">
                <InputNumber placeholder="0" min={0} style={{ width: "100%" }} addonAfter="€"
                             value={filters.minAmount} onChange={(value) => set("minAmount", value)} />
            </FormFieldComponent>

            <FormFieldComponent label="Max amount">
                <InputNumber placeholder="any" min={0} style={{ width: "100%" }} addonAfter="€"
                             value={filters.maxAmount} onChange={(value) => set("maxAmount", value)} />
            </FormFieldComponent>
        </FiltersPanelComponent>
    );
}

export default TransactionFiltersComponent;
