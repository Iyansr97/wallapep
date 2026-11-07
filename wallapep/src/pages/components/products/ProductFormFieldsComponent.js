import { Input, InputNumber } from "antd";
import { modifyStateProperty } from "../../../utils/UtilsState";
import {
    validateFormDataInputProductTitle,
    validateFormDataInputPrice
} from "../../../utils/UtilsValidations";
import CategorySelectComponent from "./CategorySelectComponent";
import FormFieldComponent from "../common/FormFieldComponent";
import RequiredFieldsNoteComponent from "../common/RequiredFieldsNoteComponent";

export const requiredProductFields = ["title", "price", "category"];

let ProductFormFieldsComponent = ({ formData, setFormData, formErrors, setFormErrors }) => {
    return (
        <>
            <RequiredFieldsNoteComponent />
            <FormFieldComponent label="Title" required error={formErrors?.title?.msg}
                valid={validateFormDataInputProductTitle(formData, "title", formErrors, setFormErrors)}>
                <Input size="large" placeholder="e.g. iPhone 13 128GB" maxLength={50} showCount
                       value={formData.title}
                       onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)} />
            </FormFieldComponent>

            <FormFieldComponent label="Description">
                <Input.TextArea placeholder="condition, size, what is included..." maxLength={1000} showCount
                                autoSize={{ minRows: 3, maxRows: 8 }} value={formData.description}
                                onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)} />
            </FormFieldComponent>

            <FormFieldComponent label="Price" required error={formErrors?.price?.msg}
                valid={validateFormDataInputPrice(formData, "price", formErrors, setFormErrors)}>
                <InputNumber size="large" placeholder="e.g. 25" min={0.01} precision={2}
                             style={{ width: "100%" }} addonAfter="€" value={formData.price}
                             onChange={(value) => modifyStateProperty(formData, setFormData, "price", value)} />
            </FormFieldComponent>

            <FormFieldComponent label="Category" required>
                <CategorySelectComponent size="large" value={formData.category}
                    onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)} />
            </FormFieldComponent>
        </>
    );
}

export default ProductFormFieldsComponent;
