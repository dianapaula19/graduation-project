enum AuthentificationAction {
  login = "login",
  register = "register",
  recoverAccount = "recover account",
  resetPassword = "reset password"
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