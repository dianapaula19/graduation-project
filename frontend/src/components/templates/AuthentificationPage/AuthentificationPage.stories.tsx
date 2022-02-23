import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AuthentificationPage from "./AuthentificationPage";
import { Action } from "./AuthentificationPage.types";

export default {
    title: "Templates/AuthentificationPage",
    component: AuthentificationPage
} as ComponentMeta<typeof AuthentificationPage>;

const Template: ComponentStory<typeof AuthentificationPage> = (args) => <AuthentificationPage {...args}/>;

export const RegistrationPage = Template.bind({});

RegistrationPage.args = {
    action: Action.register
}

export const LoginPage = Template.bind({});

LoginPage.args = {
    action: Action.login
}