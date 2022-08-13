const degreeMap: any = {
  "BACHELOR": {
    "INFO": {
      "IF": {
        "INFO": [1, 2, 3]
      },
      "ID": {
        "INFO": [1, 2, 3]
      }
    },
    "MATE": {
      "IF": {
        "MATEINFO": [1, 2, 3], 
        "MATE": [1, 2, 3],
        "MA": [1, 2, 3]
      },
    },
    "CTI": {
      "IF": {
        "TI": [1, 2, 3, 4]
      }
    }
  },
  "MASTER": {
    "INFO": {
      "IF": {
        "AI": [1, 2],
        "BDTS": [1, 2],
        "DS": [1, 2],
        "IS": [1, 2],
        "NLP": [1, 2],
        "SD": [1, 2],
        "SAL": [1, 2]
      }, 
      "IFR": {
        "BDTS": [1, 2]
      }
    },
    "MATE": {
      "IF": {
        "ASM": [1, 2],
        "AMA": [1, 2],
        "MD": [1, 2],
        "PSFS": [1, 2]
      }
    },
  }
}

const PLACEHOLDER = 'placeholder';

export {
  degreeMap,
  PLACEHOLDER
}