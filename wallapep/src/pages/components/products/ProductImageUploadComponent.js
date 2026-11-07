import { Upload, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";

let ProductImageUploadComponent = ({ images, onChange }) => {
    return (
        <Upload maxCount={1} listType="picture-card" accept="image/*" fileList={images}
                beforeUpload={() => false} onChange={({ fileList }) => onChange(fileList)}>
            { images.length == 0 &&
                <Space direction="vertical" size={4}><UploadOutlined />Image</Space> }
        </Upload>
    );
}

export default ProductImageUploadComponent;
