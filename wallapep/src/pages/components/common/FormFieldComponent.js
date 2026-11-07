import { Form } from "antd";

let FormFieldComponent = ({ label, required, valid = true, error, extra, children }) => {
    return (
        <Form.Item label={label} required={required}
                   validateStatus={valid ? undefined : "error"}
                   help={valid ? undefined : error} extra={extra}>
            {children}
        </Form.Item>
    );
}

export default FormFieldComponent;
