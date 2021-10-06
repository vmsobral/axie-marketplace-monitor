const bodyParts = require('../_resources/body-parts.json')
const classGeneMap = require('../_resources/binary-classes.json')
const geneColorMap = require('../_resources/binary-colors.json')
const binaryTraits = require('../_resources/binary-traits.json')

const PROBABILITIES = { d: 0.375, r1: 0.09375, r2: 0.03125 }

const bodyPartsMap = {}
for (const i in bodyParts) {
  bodyPartsMap[bodyParts[i].partId] = bodyParts[i]
}

async function findBestMatchPair (currentListing, wantedClass, wantedParts, size, priceCapUSD) {
  const bestPairList = []
  const axieGenesMap = getAxieGenesMap(currentListing)
  for (const id in axieGenesMap) {
    const bestPairAux = await findBestMatchGivenId(currentListing, wantedClass, wantedParts, size, priceCapUSD, id)
    bestPairAux.fatherIdPrice = axieGenesMap[id].price
    bestPairAux.fatherIdPriceUSD = axieGenesMap[id].priceUSD
    bestPairList.push(bestPairAux)
  }
  return bestPairList.sort((pairA, pairB) => pairB.probability - pairA.probability).slice(0, size)
}

async function findBestMatchGivenId (currentListing, wantedClass, wantedParts, size, priceCapUSD, matchId) {
  const fatherId = matchId
  const bestPairList = []

  const axieGenesMap = getAxieGenesMap(currentListing)

  const fatherGenes = axieGenesMap[fatherId]
  const fatherProbs = getEachPartProbability(fatherGenes, wantedParts)

  for (const motherId in axieGenesMap) {
    if (fatherId === motherId) continue
    if (parseFloat(axieGenesMap[motherId].priceUSD) > priceCapUSD) continue

    const motherGenes = axieGenesMap[motherId]
    const motherProbs = getEachPartProbability(motherGenes, wantedParts)

    let finalProb = 1
    for (const partProb in fatherProbs) {
      finalProb *= fatherProbs[partProb] + motherProbs[partProb]
    }
    bestPairList.push({
      fatherId,
      motherId,
      motherIdPrice: axieGenesMap[motherId].price,
      motherIdPriceUSD: axieGenesMap[motherId].priceUSD,
      probability: finalProb
    })
  }
  return bestPairList.sort((pairA, pairB) => pairB.probability - pairA.probability).slice(0, size)
}

function getAxieGenesMap (currentListing) {
  const axieGenesMap = {}
  for (const axieSale of currentListing) {
    const genes = genesToBin(BigInt(axieSale.axieGenes))
    axieGenesMap[axieSale.axieId] = getTraits(genes)
    axieGenesMap[axieSale.axieId].price = axieSale.price
    axieGenesMap[axieSale.axieId].priceUSD = axieSale.priceUSD
  }
  return axieGenesMap
}

function getEachPartProbability (traits, wantedParts) {
  const parts = ['eyes', 'ears', 'back', 'mouth', 'horn', 'tail']
  const probMap = {}
  for (const i in parts) {
    if (traits[parts[i]].d.partId === wantedParts[i]) {
      probMap[parts[i]] = (probMap[parts[i]] || 0) + PROBABILITIES.d
    }
    if (traits[parts[i]].r1.partId === wantedParts[i]) {
      probMap[parts[i]] = (probMap[parts[i]] || 0) + PROBABILITIES.r1
    }
    if (traits[parts[i]].r2.partId === wantedParts[i]) {
      probMap[parts[i]] = (probMap[parts[i]] || 0) + PROBABILITIES.r2
    }
  }
  return probMap
}

function genesToBin (genes) {
  let genesString = genes.toString(2)
  genesString = strMul('0', 256 - genesString.length) + genesString
  return genesString
}

function strMul (str, num) {
  let s = ''
  for (let i = 0; i < num; i++) {
    s += str
  }
  return s
}

function getClassFromGroup (group) {
  const bin = group.slice(0, 4)
  if (!(bin in classGeneMap)) {
    return 'Unknown Class'
  }
  return classGeneMap[bin]
}

const regionGeneMap = { '00000': 'global', '00001': 'japan' }

function getRegionFromGroup (group) {
  const regionBin = group.slice(8, 13)
  if (regionBin in regionGeneMap) {
    return regionGeneMap[regionBin]
  }
  return 'Unknown Region'
}

function getPatternsFromGroup (group) {
  // patterns could be 6 bits. use 4 for now
  return { d: group.slice(2, 8), r1: group.slice(8, 14), r2: group.slice(14, 20) }
}

function getColor (bin, cls) {
  let color
  if (bin === '0000') {
    color = 'ffffff'
  } else if (bin === '0001') {
    color = '7a6767'
  } else {
    color = geneColorMap[cls][bin]
  }
  return color
}

function getColorsFromGroup (group, cls) {
  return { d: getColor(group.slice(20, 24), cls), r1: getColor(group.slice(24, 28), cls), r2: getColor(group.slice(28, 32), cls) }
}

function getTraits (genes) {
  const groups = [
    genes.slice(0, 32),
    genes.slice(32, 64),
    genes.slice(64, 96),
    genes.slice(96, 128),
    genes.slice(128, 160),
    genes.slice(160, 192),
    genes.slice(192, 224),
    genes.slice(224, 256)]
  const cls = getClassFromGroup(groups[0])
  const region = getRegionFromGroup(groups[0])
  const pattern = getPatternsFromGroup(groups[1])
  const color = getColorsFromGroup(groups[1], groups[0].slice(0, 4))
  const eyes = getPartsFromGroup('eyes', groups[2], region)
  const mouth = getPartsFromGroup('mouth', groups[3], region)
  const ears = getPartsFromGroup('ears', groups[4], region)
  const horn = getPartsFromGroup('horn', groups[5], region)
  const back = getPartsFromGroup('back', groups[6], region)
  const tail = getPartsFromGroup('tail', groups[7], region)
  return { cls: cls, region: region, pattern: pattern, color: color, eyes: eyes, mouth: mouth, ears: ears, horn: horn, back: back, tail: tail }
}

function getPartFromName (traitType, partName) {
  const traitId = traitType.toLowerCase() + '-' + partName.toLowerCase().replace(/\s/g, '-')
    .replace(/[\?'\.]/g, '')
  return bodyPartsMap[traitId]
}

function getPartsFromGroup (part, group, region) {
  const skinBinary = group.slice(0, 2)
  const mystic = skinBinary === '11'
  const dClass = classGeneMap[group.slice(2, 6)]
  const dBin = group.slice(6, 12)
  const dName = getPartName(dClass, part, region, dBin, skinBinary)

  const r1Class = classGeneMap[group.slice(12, 16)]
  const r1Bin = group.slice(16, 22)
  const r1Name = getPartName(r1Class, part, region, r1Bin)

  const r2Class = classGeneMap[group.slice(22, 26)]
  const r2Bin = group.slice(26, 32)
  const r2Name = getPartName(r2Class, part, region, r2Bin)

  return { d: getPartFromName(part, dName), r1: getPartFromName(part, r1Name), r2: getPartFromName(part, r2Name), mystic: mystic }
}

const partsClassMap = {}

function getPartName (cls, part, region, binary, skinBinary = '00') {
  let trait
  if (binary in binaryTraits[cls][part]) {
    if (skinBinary === '11') {
      trait = binaryTraits[cls][part][binary].mystic
    } else if (skinBinary === '10') {
      trait = binaryTraits[cls][part][binary].xmas
    } else if (region in binaryTraits[cls][part][binary]) {
      trait = binaryTraits[cls][part][binary][region]
    } else if ('global' in binaryTraits[cls][part][binary]) {
      trait = binaryTraits[cls][part][binary].global
    } else {
      trait = 'UNKNOWN Regional ' + cls + ' ' + part
    }
  } else {
    trait = 'UNKNOWN ' + cls + ' ' + part
  }
  partsClassMap[trait + ' ' + part] = cls
  return trait
}

module.exports = {
  findBestMatchPair,
  findBestMatchGivenId
}
