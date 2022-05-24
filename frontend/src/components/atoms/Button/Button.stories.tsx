import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from "./Button";
import { ButtonModifier } from "./Button.types";

export default {
    title: "Atoms/Button",
    component: Button
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}/>;

export const DefaultButton = Template.bind({});

DefaultButton.args = {
    label: "Button"
};

export const ExcelButton = Template.bind({});

ExcelButton.args = {
    label: "Export as .xlsx",
    modifier: ButtonModifier.excel
};

export const SaveButton = Template.bind({});

SaveButton.args = {
    label: "Save",
    modifier: ButtonModifier.save
}

export const MailButton = Template.bind({});

MailButton.args = {
    label: "Mail",
    modifier: ButtonModifier.mail
}