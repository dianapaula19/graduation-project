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
  // Master
  NLP = 'NLP',
  DS = 'DS',
  SAL = 'SAL',
  SD = 'SD',
  AI = 'AI',
  IS = 'IS',
  BDTS = 'BDTS',
  PSFS = 'PSFS',
  MD = 'MD',
  ASM = 'ASM',
  AMA = 'AMA',
  // Bachelor
  TI = 'TI',
  INFO = 'INFO',
  MATEINFO = 'MATEINFO',
  MATE = 'MATE',
  MA = 'MA'
}

enum Department {
  MATH = 'MATH',
  COMPUTER_SCIENCE = 'COMPUTER_SCIENCE'
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
  Department,
  Role,
  Time
}