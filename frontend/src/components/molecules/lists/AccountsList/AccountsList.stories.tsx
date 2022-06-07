import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AccountsList from "./AccountsList";
import { Role } from "../../../App";

export default {
    title: "Molecules/AccountsList",
    component: AccountsList
} as ComponentMeta<typeof AccountsList>;

const Template: ComponentStory<typeof AccountsList> = (args) => <AccountsList {...args}/>;

export const DefaultAccountsList = Template.bind({});

DefaultAccountsList.args = {
    accounts: [
        {
          email: "rachel@chu.com",
          role: Role.STUDENT,
          verified: false
        },
        {
          email: "nick@young.com",
          role: Role.STUDENT,
          verified: true
        },
    ]
}