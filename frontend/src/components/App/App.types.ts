enum Role {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
  NONE = "NONE"
}

enum Domain {
  INFO = 'INFO',
  CTI = 'CTI',
  MATE = 'MATE'
}

enum LearningMode {
  IF = 'IF',
  IFR = 'IFR',
  ID = 'ID'
}

enum Degree {
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER'
}

enum StudyProgram {
  NLP = 'NLP',
  DS = 'DS',
  SLA = 'SLA',
  SD = 'SD',
  IA = 'IA',
  IS = 'IS',
  BDTS = 'BDTS',
  PSFS = 'PSFS',
  MD = 'MD',
  ASM = 'ASM',
  TI = 'TI',
  INFO = 'INFO',
  MATEINFO = 'MATEINFO',
  MATE = 'MATE',
  MA = 'MA'
}

enum Time {
  SECOND = 1000,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR
}

export {
  Domain, 
  LearningMode,
  Degree,
  StudyProgram,
  Role,
  Time
}