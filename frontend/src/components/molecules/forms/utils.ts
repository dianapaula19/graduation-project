import { Degree, Domain } from "../../App"

const regexRules = {
  email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
}

const maxYears = (domain: string, degree: string) => {
  if (degree === Degree.BACHELOR) {
    if (domain === Domain.CTI) {
      return 4
    }
    return 3
  }
  return 2
}

export {
  regexRules,
  maxYears
}