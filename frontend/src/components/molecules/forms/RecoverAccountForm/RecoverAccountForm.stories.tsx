import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RecoverAccountForm from "./RecoverAccountForm";

export default {
  title: "Molecules/RecoverAccountForm",
  component: RecoverAccountForm
} as ComponentMeta<typeof RecoverAccountForm>;

const Template: ComponentStory<typeof RecoverAccountForm> = () => <RecoverAccountForm />;

export const DefaultRecoverAccountForm = Template.bind({});