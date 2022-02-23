enum Action {
    login = "login",
    register = "register"
}

interface AuthetificationPageProps {
    action: Action
}

export type {
    AuthetificationPageProps
}

export {
    Action
}