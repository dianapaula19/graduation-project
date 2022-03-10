import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RegistrationForm from "./RegistrationForm";

export default {
    title: "Molecules/RegistrationForm",
    component: RegistrationForm
} as ComponentMeta<typeof RegistrationForm>;

const Template: ComponentStory<typeof RegistrationForm> = () => <RegistrationForm />;

export const DefaultRegistrationForm = Template.bind({});