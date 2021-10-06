/**
 * Criteria is an object with the following properties:
 * criteria = {
 *    region: null,
 *    parts: null,
 *    bodyShapes: null,
 *    classes: null,
 *    stages: null,
 *    numMystic: null,
 *    pureness: null,
 *    title: null,
 *    breedCount: null,
 *    hp: [],
 *    skill: [],
 *    speed: [],
 *    morale: [],
 *    breedable: null
 * }
 */

module.exports = {
  getAxieBriefList: (from, size, sort, auctionType, criteria) => ({
    operationName: 'GetAxieBriefList',
    variables: {
      from: from,
      size: size,
      sort: sort,
      auctionType: auctionType,
      criteria: criteria
    },
    query: 'query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  genes\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n'
  }),

  getAxieDetail: (axieId) => ({
    operationName: 'GetAxieDetail',
    variables: {
      axieId: axieId
    },
    query: 'query GetAxieDetail($axieId: ID!) {\n  axie(axieId: $axieId) {\n    ...AxieDetail\n    __typename\n  }\n}\n\nfragment AxieDetail on Axie {\n  id\n  image\n  class\n  chain\n  name\n  genes\n  owner\n  birthDate\n  bodyShape\n  class\n  sireId\n  sireClass\n  matronId\n  matronClass\n  stage\n  title\n  breedCount\n  level\n  figure {\n    atlas\n    model\n    image\n    __typename\n  }\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  ownerProfile {\n    name\n    __typename\n  }\n  battleInfo {\n    ...AxieBattleInfo\n    __typename\n  }\n  children {\n    id\n    name\n    class\n    image\n    title\n    stage\n    __typename\n  }\n  __typename\n}\n\nfragment AxieBattleInfo on AxieBattleInfo {\n  banned\n  banUntil\n  level\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n'
  }),

  getAxieTransferHistory: (axieId, from, size) => ({
    operationName: 'GetAxieTransferHistory',
    variables: {
      axieId: axieId,
      from: from,
      size: size
    },
    query: 'query GetAxieTransferHistory($axieId: ID!, $from: Int!, $size: Int!) {\n  axie(axieId: $axieId) {\n    id\n    transferHistory(from: $from, size: $size) {\n      ...TransferRecords\n      __typename\n    }\n    ethereumTransferHistory(from: $from, size: $size) {\n      ...TransferRecords\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment TransferRecords on TransferRecords {\n  total\n  results {\n    from\n    to\n    timestamp\n    txHash\n    withPrice\n    __typename\n  }\n  __typename\n}\n'
  }),

  getRecentlyAxiesSold: (from, size) => ({
    operationName: 'GetRecentlyAxiesSold',
    variables: {
      from: from,
      size: size
    },
    query: 'query GetRecentlyAxiesSold($from: Int, $size: Int) {\n  settledAuctions {\n    axies(from: $from, size: $size) {\n      total\n      results {\n        ...AxieSettledBrief\n        transferHistory {\n          ...TransferHistoryInSettledAuction\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieSettledBrief on Axie {\n  id\n  name\n  image\n  class\n  breedCount\n  __typename\n}\n\nfragment TransferHistoryInSettledAuction on TransferRecords {\n  total\n  results {\n    ...TransferRecordInSettledAuction\n    __typename\n  }\n  __typename\n}\n\nfragment TransferRecordInSettledAuction on TransferRecord {\n  from\n  to\n  txHash\n  timestamp\n  withPrice\n  withPriceUsd\n  fromProfile {\n    name\n    __typename\n  }\n  toProfile {\n    name\n    __typename\n  }\n  __typename\n}\n'
  }),

  getRecentlyAxiesSoldWithDetails: (from, size) => ({
    operationName: 'GetRecentlyAxiesSold',
    variables: {
      from: from,
      size: size
    },
    query: 'query GetRecentlyAxiesSold($from: Int, $size: Int) {\n  settledAuctions {\n    axies(from: $from, size: $size) {\n      total\n      results {\n        ...AxieSettledBrief\n        transferHistory {\n          ...TransferHistoryInSettledAuction\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieSettledBrief on Axie {\n  id\n  name\n  image\n  class\n  breedCount\n  parts { ...AxiePart __typename } stats { ...AxieStats __typename } __typename\n}\n\nfragment TransferHistoryInSettledAuction on TransferRecords {\n  total\n  results {\n    ...TransferRecordInSettledAuction\n    __typename\n  }\n  __typename\n}\n\nfragment TransferRecordInSettledAuction on TransferRecord {\n  from\n  to\n  txHash\n  timestamp\n  withPrice\n  withPriceUsd\n  fromProfile {\n    name\n    __typename\n  }\n  toProfile {\n    name\n    __typename\n  }\n  __typename\n}\n' +
      'fragment AxiePart on AxiePart {\n' +
      '  id\n' +
      '  name\n' +
      '  class\n' +
      '  type\n' +
      '  specialGenes\n' +
      '  stage\n' +
      '  __typename\n' +
      '}\n' +
      '\n' +
      'fragment AxieStats on AxieStats {\n' +
      '  hp\n' +
      '  speed\n' +
      '  skill\n' +
      '  morale\n' +
      '  __typename\n' +
      '}'
  }),

  getRecentlyAxiesListed: (from, size, sort, auctionType, criteria) => ({
    operationName: 'GetAxieLatest',
    variables: {
      from,
      size,
      sort,
      auctionType,
      criteria
    },
    query: 'query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  battleInfo {    banned    __typename  }\n name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n'
  })
}
