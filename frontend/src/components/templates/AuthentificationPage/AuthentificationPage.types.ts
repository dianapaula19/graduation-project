enum AuthentificationAction {
    login = "login",
    register = "register"
}

interface IAuthentificationPageProps {
    action: AuthentificationAction
}

export type {
    IAuthentificationPageProps
}

export {
    AuthentificationAction
}