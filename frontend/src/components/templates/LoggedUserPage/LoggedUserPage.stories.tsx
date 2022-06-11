import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LoggedUserPage from "./LoggedUserPage";

export default {
  title: "Templates/LoggedUserPage",
  component: LoggedUserPage
} as ComponentMeta<typeof LoggedUserPage>;

const Template: ComponentStory<typeof LoggedUserPage> = () => <LoggedUserPage />;

export const DefaultLoggedUserPage = Template.bind({});