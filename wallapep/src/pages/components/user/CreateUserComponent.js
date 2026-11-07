import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { modifyStateProperty } from "../../../utils/UtilsState";
import { Card, Col, Row, Form, Input, Button, Typography, DatePicker, Select, Space, Steps } from "antd";
import {
    UserAddOutlined, MailOutlined, LockOutlined, IdcardOutlined, EnvironmentOutlined,
    ArrowLeftOutlined, ArrowRightOutlined, UserOutlined, ExclamationCircleFilled
} from "@ant-design/icons";
import { countries, filterCountryOption } from "../../../utils/UtilsCountries";
import { disabledBirthdayDate } from "../../../utils/UtilsDates";
import {
    validateFormDataInputRequired,
    validateFormDataInputEmail,
    allowSubmitForm,
    setServerErrors,
    joinAllServerErrorMessages,
    documentNumberError,
    documentExamples
} from "../../../utils/UtilsValidations"
import PageTitleComponent from "../common/PageTitleComponent";
import FormFieldComponent from "../common/FormFieldComponent";
import RequiredFieldsNoteComponent from "../common/RequiredFieldsNoteComponent";
import dayjs from "dayjs";
import { loginUser } from "../../../utils/UtilsUsers";

const steps = [
    { title: "Account", icon: <UserOutlined /> },
    { title: "Personal data", icon: <IdcardOutlined /> },
    { title: "Address", icon: <EnvironmentOutlined /> },
];

let CreateUserComponent = ({ openNotification, setLogin }) => {
    let router = useRouter()

    let requiredInForm = ["email", "password"]
    let [formErrors, setFormErrors] = useState({})

    let [formData, setFormData] = useState({})
    let [step, setStep] = useState(0)

    let clickCreate = async () => {
        let response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json " },
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            let result = await loginUser(formData.email, formData.password)
            if (result.ok) {
                setLogin(true)
                openNotification("top", "Welcome to Wallapep! Your account has been created", "success")
                router.push("/");
            } else {
                openNotification("top", "User created, now you can login", "success")
                router.push("/login");
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors, setFormErrors)
            openNotification("top", joinAllServerErrorMessages(serverErrors), "error")
            setStep(0)
        }
    }

    let input = (key, placeholder, icon) =>
        <Input placeholder={placeholder} prefix={icon} value={formData[key]}
               onChange={(i) => modifyStateProperty(formData, setFormData, key, i.currentTarget.value)} />

    let accountStep =
        <>
            <RequiredFieldsNoteComponent />
            <FormFieldComponent label="Name">{input("name", "e.g. Lucía")}</FormFieldComponent>
            <FormFieldComponent label="Surname">{input("surname", "e.g. Fernández")}</FormFieldComponent>

            <FormFieldComponent label="Email" required error={formErrors?.email?.msg}
                valid={validateFormDataInputEmail(formData, "email", formErrors, setFormErrors)}>
                {input("email", "e.g. name@example.com", <MailOutlined />)}
            </FormFieldComponent>

            <FormFieldComponent label="Password" required error={formErrors?.password?.msg}
                valid={validateFormDataInputRequired(formData, "password", formErrors, setFormErrors)}>
                <Input.Password placeholder="your password" prefix={<LockOutlined />} value={formData.password}
                    onChange={(i) => modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)} />
            </FormFieldComponent>
        </>

    let documentError = documentNumberError(formData.documentIdentity, formData.documentNumber);

    let personalStep =
        <>
            <FormFieldComponent label="Document type">
                <Select placeholder="select" allowClear value={formData.documentIdentity}
                    options={[
                        { value: "DNI", label: "DNI" },
                        { value: "NIE", label: "NIE" },
                        { value: "Passport", label: "Passport" },
                    ]}
                    onChange={(value) => modifyStateProperty(formData, setFormData, "documentIdentity", value)} />
            </FormFieldComponent>
            <FormFieldComponent label="Document number" valid={documentError == null} error={documentError}>
                {input("documentNumber", documentExamples[formData.documentIdentity] ?? "select the type first")}
            </FormFieldComponent>
            <FormFieldComponent label="Birthday">
                <DatePicker placeholder="select a date" style={{ width: "100%" }}
                    value={formData.birthday ? dayjs(formData.birthday) : null}
                    disabledDate={disabledBirthdayDate}
                    onChange={(date) => modifyStateProperty(formData, setFormData, "birthday", date ? date.valueOf() : null)} />
            </FormFieldComponent>
        </>

    let addressStep =
        <>
            <Typography.Paragraph type="secondary">
                Your purchases will be sent to this address.
            </Typography.Paragraph>
            <FormFieldComponent label="Country">
                <Select placeholder="type or select a country" showSearch allowClear value={formData.country}
                    options={countries} filterOption={filterCountryOption}
                    onChange={(value) => modifyStateProperty(formData, setFormData, "country", value)} />
            </FormFieldComponent>
            <FormFieldComponent label="Address">{input("address", "street, number, floor", <EnvironmentOutlined />)}</FormFieldComponent>
            <FormFieldComponent label="Postal code">{input("postalCode", "e.g. 33003")}</FormFieldComponent>
        </>

    let canContinue = allowSubmitForm(formData, formErrors, requiredInForm);

    let hasErrors = formErrors?.email?.msg != null || formErrors?.password?.msg != null;
    let accountHasProblem = hasErrors || (!canContinue && step != 0);

    let stepProblems = [accountHasProblem, documentError != null, false];
    let stepItems = steps.map((item, i) => stepProblems[i] ?
        {
            ...item, status: "error",
            title: <Space size={6}>
                       <ExclamationCircleFilled style={{ color: "#ff4d4f", fontSize: 16 }} />
                       {item.title}
                   </Space>
        } : item);
    let isLastStep = step == steps.length - 1;

    return (
        <div>
            <PageTitleComponent icon={<UserAddOutlined />} title="Create your account" center level={3} />
            <Row justify="center">
                <Col xs={24} md={20} lg={14} xl={10}>
                    <Card styles={{ body: { padding: "14px 24px" } }}>
                        <Steps current={step} items={stepItems} size="small" onChange={setStep}
                               style={{ marginBottom: 10 }} />

                        <Form layout="vertical" className="compact-form">
                            {step == 0 && accountStep}
                            {step == 1 && personalStep}
                            {step == 2 && addressStep}
                        </Form>

                        {isLastStep && !canContinue &&
                            <Typography.Paragraph type="danger" style={{ marginTop: 8, marginBottom: 0 }}>
                                <ExclamationCircleFilled /> Complete the required fields in the Account step.
                            </Typography.Paragraph>}
                        {isLastStep && documentError != null &&
                            <Typography.Paragraph type="danger" style={{ marginTop: 8, marginBottom: 0 }}>
                                <ExclamationCircleFilled /> Check the document number in the Personal data step.
                            </Typography.Paragraph>}

                        <Row justify="space-between" style={{ marginTop: 10 }}>
                            <Col>
                                {step > 0 &&
                                    <Button icon={<ArrowLeftOutlined />} onClick={() => setStep(step - 1)}>Back</Button>}
                            </Col>
                            <Col>
                                <Space>
                                    {step > 0 && !isLastStep &&
                                        <Button onClick={() => setStep(steps.length - 1)}>Skip</Button>}
                                    {isLastStep ?
                                        <Button type="primary" icon={<UserAddOutlined />}
                                                disabled={!canContinue || documentError != null} onClick={clickCreate}>Create User</Button> :
                                        <Button type="primary" disabled={step == 0 && !canContinue}
                                                onClick={() => setStep(step + 1)}>Next <ArrowRightOutlined /></Button>}
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                    <Typography.Paragraph style={{ textAlign: "center", marginTop: 8, marginBottom: 0 }}>
                        Already have an account? <Link href="/login">Log in</Link>
                    </Typography.Paragraph>
                </Col>
            </Row>
        </div>
    )
}

export default CreateUserComponent;
