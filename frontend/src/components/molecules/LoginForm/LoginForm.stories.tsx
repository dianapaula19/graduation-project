import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LoginForm from "./LoginForm";

export default {
    title: "Molecules/LoginForm",
    component: LoginForm
} as ComponentMeta<typeof LoginForm>;

const Template: ComponentStory<typeof LoginForm> = () => <LoginForm />;

export const DefaultLoginForm = Template.bind({});