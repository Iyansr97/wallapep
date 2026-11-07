import {useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Button, Row, Col, Space, Typography, Form } from "antd";
import { EditOutlined, CalendarOutlined } from "@ant-design/icons";
import { timestampToString } from "../../../utils/UtilsDates";
import {
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages
} from "../../../utils/UtilsValidations";
import ProductFormFieldsComponent, { requiredProductFields } from "./ProductFormFieldsComponent";
import ProductImageUploadComponent from "./ProductImageUploadComponent";
import FormFieldComponent from "../common/FormFieldComponent";
import { productImageUrl, defaultProductImage, uploadProductImage } from "../../../utils/UtilsProducts";

let EditProductFormComponent = ({id, openNotification}) => {
    let router = useRouter()

    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})

    let [images, setImages] = useState([])
    let [hadImage, setHadImage] = useState(false)

    useEffect(() => {
        if (id != undefined) {
            getProduct(id);
            getCurrentImage(id);
        }
    }, [id])

    let getCurrentImage = async (id) => {
        let url = productImageUrl(id)
        let response = await fetch(url, { method: "HEAD" })
        if (response.ok) {
            setHadImage(true)
            setImages([{ uid: "current", name: "Current image", status: "done", url }])
        }
    }

    let getProduct = async (id) => {
         let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            setFormData(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let saveImage = async () => {
        let newImage = images[0]?.originFileObj
        if (newImage != null)
            return uploadProductImage(id, newImage)

        if (hadImage && images.length == 0) {
            let genericImage = await (await fetch(defaultProductImage)).blob()
            return uploadProductImage(id, genericImage)
        }
        return true
    }

    let clickEditProduct = async () => {
        let response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/products/"+id,
            {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formData)
            });

        if ( response.ok ){
            let imageSaved = await saveImage()
            openNotification?.("top", imageSaved ? "Product updated" : "Product updated, but the image could not be saved",
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
        <Row align="middle" justify="center" style={{ minHeight: "70vh"}}>
            <Col xs={24} sm={20} md={14} lg={10} xl={8}>
                <Card title={<Space><EditOutlined />Edit product</Space>}>
                    <Form layout="vertical">
                    <ProductFormFieldsComponent formData={formData} setFormData={setFormData}
                                                formErrors={formErrors} setFormErrors={setFormErrors} />

                    <FormFieldComponent label="Image" extra="Optional. If you do not upload one, a generic image is shown.">
                        <ProductImageUploadComponent images={images} onChange={setImages} />
                    </FormFieldComponent>

                    {formData.date &&
                        <Typography.Paragraph type="secondary">
                            <Space size={4}><CalendarOutlined />Published on {timestampToString(formData.date)}</Space>
                        </Typography.Paragraph>}

                    { allowSubmitForm(formData, formErrors, requiredProductFields) ?
                        <Button type="primary" onClick={clickEditProduct} block size="large">Save changes</Button> :
                        <Button type="primary" block disabled size="large">Save changes</Button>
                    }
                    </Form>
                </Card>
            </Col>
        </Row>

    )
}

export default EditProductFormComponent;
