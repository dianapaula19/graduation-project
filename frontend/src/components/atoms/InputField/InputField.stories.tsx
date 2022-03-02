import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import InputField from "./InputField";
import { InputFieldModifier, InputFieldType } from "./InputField.types";

export default {
    title: "Atoms/InputField",
    component: InputField
} as ComponentMeta<typeof InputField>;

const Template: ComponentStory<typeof InputField> = (args) => <InputField {...args}/>;

export const TextField = Template.bind({});

TextField.args = {
    label: "Text",
    placeholder: "Text",
    type: InputFieldType.text,
}

export const EmailField = Template.bind({});

EmailField.args = {
    label: "Email",
    placeholder: "Email",
    type: InputFieldType.email,
}

export const PasswordField = Template.bind({});

PasswordField.args = {
    label: "Password",
    placeholder: "Password",
    type: InputFieldType.password,
}

export const ErrorField = Template.bind({});

ErrorField.args = {
    label: "Email",
    type: InputFieldType.email,
    modifier: InputFieldModifier.error,
    error: true,
    errorMessage: "You must provide a valid email address."
}