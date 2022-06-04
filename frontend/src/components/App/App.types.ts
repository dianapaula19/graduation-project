enum Role {
  none = "none",
  student = "student",
  teacher = "teacher",
  secretary = "secretary",
  admin = "admin"
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

export {
  Domain, 
  LearningMode,
  Degree,
  StudyProgram,
  Role
}