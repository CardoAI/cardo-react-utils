import { MathOp } from "./MathOp";
import chroma from "chroma-js"
import { formatters } from "./formatters";
import { theme } from "@cardoai/constants";

export const lightenColor = (color, percent) => {
  const num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
  return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};

const regions = [
  {
    "code": "CM",
    "name": "Campania",
    "ratio": 0.3253347949658562,
    "balance": 28096162.63,
    "gwar_open": 0.10381931755382924,
    "avg_residual_term": 5.585092667203868,
    "wam": 5.518894813804705,
    "avg_rating": "C"
  },
  {
    "code": "LO",
    "name": "Lombardy",
    "ratio": 0.20544172414045042,
    "balance": 17742105,
    "gwar_open": 0.10338012090448118,
    "avg_residual_term": 5.759295499021526,
    "wam": 5.74689639493249,
    "avg_rating": "C"
  },
  {
    "code": "LZ",
    "name": "Lazio",
    "ratio": 0.15208455599041554,
    "balance": 13134139,
    "gwar_open": 0.10374671646919528,
    "avg_residual_term": 5.656406124093473,
    "wam": 5.695859443871728,
    "avg_rating": "C"
  },
  {
    "code": "VE",
    "name": "Veneto",
    "ratio": 0.06881021513680587,
    "balance": 5942503,
    "gwar_open": 0.10341085098316316,
    "avg_residual_term": 5.742579908675799,
    "wam": 5.731071726177908,
    "avg_rating": "C"
  },
  {
    "code": "ER",
    "name": "Emilia-Romagna",
    "ratio": 0.04350264712902946,
    "balance": 3756922,
    "gwar_open": 0.10426023430883047,
    "avg_residual_term": 5.566069546891464,
    "wam": 5.573448728098628,
    "avg_rating": "C"
  },
  {
    "code": "PI",
    "name": "Piedmont",
    "ratio": 0.03010297466481656,
    "balance": 2599716,
    "gwar_open": 0.10595166264315026,
    "avg_residual_term": 5.826712328767123,
    "wam": 5.851497253114076,
    "avg_rating": "D"
  },
  {
    "code": "MA",
    "name": "Marche",
    "ratio": 0.029538760133876314,
    "balance": 2550990,
    "gwar_open": 0.10674379981889384,
    "avg_residual_term": 5.713382507903056,
    "wam": 5.770775004514766,
    "avg_rating": "D"
  },
  {
    "code": "SA",
    "name": "Sardinia",
    "ratio": 0.0293334585775497,
    "balance": 2533260,
    "gwar_open": 0.10419541882791344,
    "avg_residual_term": 5.700587084148728,
    "wam": 5.724050533618547,
    "avg_rating": "C"
  },
  {
    "code": "AB",
    "name": "Abruzzo",
    "ratio": 0.025813619554090107,
    "balance": 2229284,
    "gwar_open": 0.09865962923521633,
    "avg_residual_term": 5.679794520547945,
    "wam": 5.66092717329992,
    "avg_rating": "B"
  },
  {
    "code": "FV",
    "name": "Friuli-Venezia Giulia",
    "ratio": 0.017428596818969706,
    "balance": 1505147,
    "gwar_open": 0.1032031374344167,
    "avg_residual_term": 5.616438356164384,
    "wam": 5.650398459692614,
    "avg_rating": "C"
  },
  {
    "code": "TO",
    "name": "Tuscany",
    "ratio": 0.017018016864980477,
    "balance": 1469689,
    "gwar_open": 0.10780770850159456,
    "avg_residual_term": 5.700821917808219,
    "wam": 5.632894330444358,
    "avg_rating": "D"
  },
  {
    "code": "MO",
    "name": "Molise",
    "ratio": 0.011292755110495536,
    "balance": 975251,
    "gwar_open": 0.10619152218249456,
    "avg_residual_term": 5.728767123287671,
    "wam": 5.710650508615815,
    "avg_rating": "D"
  },
  {
    "code": "UM",
    "name": "Umbria",
    "ratio": 0.010538709010778162,
    "balance": 910131,
    "gwar_open": 0.11037111701502311,
    "avg_residual_term": 5.826712328767123,
    "wam": 5.8313736861875505,
    "avg_rating": "E"
  },
  {
    "code": "CA",
    "name": "Calabria",
    "ratio": 0.010112392744603491,
    "balance": 873314,
    "gwar_open": 0.1087671655326721,
    "avg_residual_term": 5.6801369863013695,
    "wam": 5.680117292777463,
    "avg_rating": "E"
  },
  {
    "code": "BA",
    "name": "Basilicata",
    "ratio": 0.00765069623779582,
    "balance": 660720,
    "gwar_open": 0.1119,
    "avg_residual_term": 5.532876712328767,
    "wam": 5.645205479452055,
    "avg_rating": "F"
  },
  {
    "code": "LI",
    "name": "Liguria",
    "ratio": 0.006070094261388862,
    "balance": 524218,
    "gwar_open": 0.0942,
    "avg_residual_term": 5.364383561643836,
    "wam": 5.364383561643836,
    "avg_rating": "A"
  },
  {
    "code": "SI",
    "name": "Sicily",
    "ratio": 0.005585279209959704,
    "balance": 482349,
    "gwar_open": 0.10228179969275358,
    "avg_residual_term": 5.701369863013698,
    "wam": 5.715876547865345,
    "avg_rating": "C"
  },
  {
    "code": "PU",
    "name": "Apulia",
    "ratio": 0.0043407094481381,
    "balance": 374867,
    "gwar_open": 0.10199926213830506,
    "avg_residual_term": 5.742465753424658,
    "wam": 5.757428663923216,
    "avg_rating": "C"
  }
]

const palette = [
  theme.colors.lilywhite,
  theme.colors.dogerblue,
  theme.colors.royalblue,
  theme.colors.purplejackson,
]


export const computeColorIntensity = (records, entity, colors = palette) => {
  const scale = chroma.scale(colors);

  function getExtremum(type) {
    return Math[type](...records.map(item => item[entity]));
  }

  const min = getExtremum("min");

  const max = getExtremum("max");

  const classNumber = 4


  const calculateColorIntensity = (value) => {
    const intensity = MathOp.divide(value, max);
    return scale(intensity).hex()
  }

  const prepareLegend = () => {
    const prepareData = [];
    const diff = MathOp.subtract(max, min);

    const range = MathOp.divide(diff, classNumber);

    let tempMin = min;
    let tempMax;
    while (tempMin < max) {
      tempMax = tempMin + range;
      const average = MathOp.divide((tempMin + tempMax), 2);

      prepareData.push({
        color: calculateColorIntensity(average),
        label: `${formatters.percent(tempMin, 1)} - ${formatters.percent(tempMax, 1)}`
      })
      tempMin = tempMax;
    }
    return prepareData;
  };


  return {
    records: records.map(record => {
      const value = record[entity];
      return {
        ...record,
        color: calculateColorIntensity(value)
      }
    }),
    legend: prepareLegend()
  }

}


const result = computeColorIntensity(regions, "ratio");
