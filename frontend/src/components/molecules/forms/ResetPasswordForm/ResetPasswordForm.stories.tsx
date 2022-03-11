import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ResetPasswordForm from "./ResetPasswordForm";

export default {
    title: "Molecules/ResetPasswordForm",
    component: ResetPasswordForm
} as ComponentMeta<typeof ResetPasswordForm>;

const Template: ComponentStory<typeof ResetPasswordForm> = () => <ResetPasswordForm />;

export const DefaultResetPasswordForm = Template.bind({});