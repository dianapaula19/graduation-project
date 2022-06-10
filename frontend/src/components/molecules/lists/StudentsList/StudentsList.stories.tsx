import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StudentsList from "./StudentsList";

export default {
    title: "Molecules/StudentsList",
    component: StudentsList
} as ComponentMeta<typeof StudentsList>;

const Template: ComponentStory<typeof StudentsList> = (args) => <StudentsList {...args}/>;

export const DefaultStudentsList = Template.bind({});

DefaultStudentsList.args = {
    students: [
        {
            first_name: "Rachel",
            last_name: "Chu",
            email: "rachel@chu.com"
        },
        {
            first_name: "Nick",
            last_name: "Young",
            email: "nick@young.com"
        },
    ]
}