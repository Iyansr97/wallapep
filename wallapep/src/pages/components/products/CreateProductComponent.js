import {useState} from "react";
import { useRouter } from "next/router";
import {Card, Button, Row, Col, Form, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages
} from "../../../utils/UtilsValidations";
import ProductFormFieldsComponent, { requiredProductFields } from "./ProductFormFieldsComponent";
import ProductImageUploadComponent from "./ProductImageUploadComponent";
import FormFieldComponent from "../common/FormFieldComponent";
import { uploadProductImage } from "../../../utils/UtilsProducts";

let CreateProductComponent = ({ openNotification }) => {
    let router = useRouter()

    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})

    let [images, setImages] = useState([])

    let clickCreateProduct = async () => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products",{
            method: "POST",
            headers: {
                "Content-Type" : "application/json ",
                "apikey": localStorage.getItem("apiKey")
            },
            body: JSON.stringify(formData)
        })

        if (response.ok){
            let data = await response.json()
            let imageSaved = images.length == 0 || await uploadProductImage(data.productId, images[0].originFileObj)
            openNotification?.("top", imageSaved ? "Product created" : "Product created, but the image could not be saved",
                               imageSaved ? "success" : "warning")
            router.push("/myProducts")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors, setFormErrors)
            openNotification?.("top", joinAllServerErrorMessages(serverErrors), "error")
        }
    }

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col xs={24} sm={20} md={14} lg={10} xl={8}>
                <Card title={<Space><PlusOutlined />Sell a product</Space>}>
                    <Form layout="vertical">
                    <ProductFormFieldsComponent formData={formData} setFormData={setFormData}
                                                formErrors={formErrors} setFormErrors={setFormErrors} />

                    <FormFieldComponent label="Image" extra="Optional. If you do not upload one, a generic image is shown.">
                        <ProductImageUploadComponent images={images} onChange={setImages} />
                    </FormFieldComponent>

                    { allowSubmitForm(formData, formErrors, requiredProductFields) ?
                        <Button type="primary" onClick={clickCreateProduct} block size="large">Sell Product</Button> :
                        <Button type="primary" block disabled size="large">Sell Product</Button>
                    }
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default CreateProductComponent;
