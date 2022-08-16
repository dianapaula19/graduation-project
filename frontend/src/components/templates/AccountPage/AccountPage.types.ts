enum AccountAction {
  login = "login",
  registration = "registration",
  recoverAccount = "recoverAccount",
  resetPassword = "resetPassword"
}

interface IAuthentificationPageProps {
  action: AccountAction
}

export type {
  IAuthentificationPageProps
}

export {
  AccountAction
}