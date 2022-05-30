import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loginToken, loginUserData } from "../../../features/auth/loginSlice";
import { IStudentDataRequest, studentDataAsync, studentDataData, studentDataStatus } from "../../../features/user/student/studentDataSlice";
import { ApiStatus } from "../../../features/Utils";
import { Role } from "../../App";
import LoggedUserPage from "../../templates/LoggedUserPage";

const PersonalDataPage = () => {


    const dispatch = useAppDispatch();

    const userData = useAppSelector(loginUserData);
    const token = useAppSelector(loginToken);

    const role = userData?.role;
    const email = userData?.email;

    const studentStatus = useAppSelector(studentDataStatus);
    const studentData = useAppSelector(studentDataData);

    console.log(studentStatus);

    useEffect(() => {
        switch(role) {
            case Role.student:
                if (studentStatus === ApiStatus.idle && email !== undefined && token !== null) {
                    dispatch(studentDataAsync({
                        token, 
                        email
                    }))
                }

        }
    }, [studentStatus, email, token]);

    switch(role) {
        case Role.student:
            let component = null;
            switch (studentStatus) {
                case ApiStatus.loading:
                    component = <>Loading...</>
                    break;
                case ApiStatus.success:
                    component = <>Success...</>
                    break;
                case ApiStatus.failed:
                    component = <>Failed...</>
                    break;
                default:
                    component = <>Idle...</>
                    break;
            }
            return <LoggedUserPage>{component}</LoggedUserPage>
        default:
            return <LoggedUserPage>

            </LoggedUserPage>    
    }
}

export default PersonalDataPage;