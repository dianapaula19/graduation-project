enum AuthentificationAction {
    login = "login",
    register = "register"
}

interface IAuthetificationPageProps {
    action: AuthentificationAction
}

export type {
    IAuthetificationPageProps
}

export {
    AuthentificationAction
}