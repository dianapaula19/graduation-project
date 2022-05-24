enum Role {
  none = "none",
  student = "student",
  teacher = "teacher",
  secretary = "secretary"
}

enum Domain {
  INFO = 'Informatică',
  CTI = 'Calculatoare și Tehnologia Informației',
  MATE = 'Matematică'
}

enum LearningMode {
  IF = 'Învățământ cu Frecvență',
  IFR = 'Învățământ cu Frecvență Redusă',
  ID = 'Învățământ la Distanță'
}

enum Degree {
  LICENTA = 'Licență',
  MASTER = 'Master'
}

enum StudyProgram {
  NLP = 'Natural Language Processing',
  DS = 'Data Science',
  SLA = 'Securitate și Logică Aplicată',
  SD = 'Sisteme Distribuite',
  IA = 'Inteligență Artificială',
  IS = 'Inginerie Software',
  BDTS = 'Baze de Date și Tehnologii Software',
  PSFS = 'Probabilități și Statistică în Finanțe și Științe',
  MD = 'Matematică Didactică',
  ASM = 'Advanced Studies in Mathematics',
  TI = 'Tehnlogia Informației',
  INFO = 'Informatică',
  MATEINFO = 'Matematică-Informatică',
  MATE = 'Matematică',
  MA = 'Matematici Aplicate'
}

export {
  Domain, 
  LearningMode,
  Degree,
  StudyProgram,
  Role
}