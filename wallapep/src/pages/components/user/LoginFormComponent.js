import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {modifyStateProperty} from "../../../utils/UtilsState";
import {Card, Col, Row, Form, Input, Button , Typography, Space } from "antd";
import { LoginOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import {
    validateFormDataInputRequired,
    validateFormDataInputEmail,
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages
 } from "../../../utils/UtilsValidations"
import FormFieldComponent from "../common/FormFieldComponent";
import { loginUser } from "../../../utils/UtilsUsers";
import RequiredFieldsNoteComponent from "../common/RequiredFieldsNoteComponent";

let LoginFormComponent = ({setLogin, openNotification}) => {
    let router = useRouter()

    let requiredInForm = ["email","password"]
    let [formErrors, setFormErrors] = useState({})

    let [formData,setFormData] = useState({

    })

    let clickLogin = async () => {
        let result = await loginUser(formData.email, formData.password)

        if (result.ok){
            setLogin(true)
            openNotification("top", "Login successfull", "success")
            router.push("/products");
        } else {
            let serverErrors = result.errors;

            setServerErrors(serverErrors,setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )
        }

    }

    let canSubmit = allowSubmitForm(formData,formErrors,requiredInForm)

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh"}}>
            <Col xs={0} sm={0} md={12} lg={8} xl={6}  ><img src="/iniciar-sesion.png" width="100%" alt=""/></Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} >
                <Card title={<Space><LoginOutlined />Login</Space>} style={{ width: "100%", margin: "15px" }}>
                    <Form layout="vertical" requiredMark>
                        <RequiredFieldsNoteComponent />
                        <FormFieldComponent label="Email" required error={formErrors?.email?.msg}
                            valid={validateFormDataInputEmail(formData, "email", formErrors, setFormErrors)}>
                            <Input placeholder="e.g. name@example.com" prefix={<MailOutlined />}
                                value={formData.email}
                                onChange={(i) => modifyStateProperty(formData, setFormData, "email", i.currentTarget.value)}/>
                        </FormFieldComponent>

                        <FormFieldComponent label="Password" required error={formErrors?.password?.msg}
                            valid={validateFormDataInputRequired(formData, "password", formErrors, setFormErrors)}>
                            <Input.Password prefix={<LockOutlined />} placeholder="your password"
                                value={formData.password}
                                onPressEnter={() => { if (canSubmit) clickLogin() }}
                                onChange={(i) => modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)}/>
                        </FormFieldComponent>

                        <Form.Item>
                            <Button type="primary" onClick={clickLogin} block disabled={!canSubmit}>Login</Button>
                        </Form.Item>
                    </Form>
                    <Typography.Text type="secondary">
                        Don't have an account? <Link href="/register">Register</Link>
                    </Typography.Text>
                </Card>
            </Col>

    </Row>

    )
}

export default LoginFormComponent;
