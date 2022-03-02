import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SideNav from "./SideNav";

export default {
    title: "Molecules/SideNav",
    component: SideNav
} as ComponentMeta<typeof SideNav>;

const Template: ComponentStory<typeof SideNav> = () => <SideNav />;

export const DefaultSideNav = Template.bind({});