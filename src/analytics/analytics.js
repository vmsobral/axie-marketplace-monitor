function mostSoldPartsConfig(salesList, number) {
  const salesCount = salesList.reduce((accum, actual) => {
    const parts = actual.axieParts.map((part) => part.partId)
    const key = `${actual.axieClass}|${parts.join('|')}`
    accum[key] = accum[key] ?
      {
        qtt: accum[key].qtt + 1,
        price: accum[key].price + parseInt(actual.price),
        priceUSD: accum[key].priceUSD + parseFloat(actual.priceUSD)
      } :
      {
        qtt: 1,
        price: parseInt(actual.price),
        priceUSD: parseFloat(actual.priceUSD)
      }
    return accum
  }, {})

  const salesCountList = Object.entries(salesCount)
  salesCountList.sort((a, b) => {
    if (a[1].qtt < b[1].qtt) return 1
    if (a[1].qtt > b[1].qtt) return -1
    return 0
  })

  return salesCountList.slice(0, number)
}

function mostExpensivePartsConfig(salesList) {
  const salesCount = salesList.reduce((accum, actual) => {
    const parts = actual.axieParts.map((part) => part.partId)
    const key = `${actual.axieClass}|${parts.join('|')}`
    if (!accum[key] || accum[key].price < parseInt(actual.price)) {
      accum[key] = { price: parseInt(actual.price), priceUSD: parseFloat(actual.priceUSD) }
    }
    return accum
  }, {})

  const salesByPrice = Object.entries(salesCount)
  salesByPrice.sort((a, b) => {
    if (a[1].price < b[1].price) return 1
    if (a[1].price > b[1].price) return -1
    return 0
  })

  return salesByPrice.slice(0, 5)
}

module.exports = {
  mostSoldPartsConfig,
  mostExpensivePartsConfig
}
