import { Typography } from "antd";

let RequiredFieldsNoteComponent = () => {
    return (
        <Typography.Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
            Fields marked with <span style={{ color: "#ff4d4f" }}>*</span> are required.
        </Typography.Paragraph>
    );
}

export default RequiredFieldsNoteComponent;
