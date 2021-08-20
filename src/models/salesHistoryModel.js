const { DateTime } = require('luxon')

module.exports = function (axiesSoldResponse) {
  const axiesSoldList = axiesSoldResponse.data.data.settledAuctions.axies.results

  return axiesSoldList.map((axieSale) => {
    const lastTx = axieSale.transferHistory.results[0]

    return {
      _id: lastTx.txHash,
      form: lastTx.from,
      to: lastTx.to,
      dateTime: DateTime.fromMillis(lastTx.timestamp * 1000, { zone: 'UTC' }).toJSDate(),
      price: lastTx.withPrice,
      priceUSD: lastTx.withPriceUsd,
      axieId: axieSale.id,
      axieImage: axieSale.image,
      axieClass: axieSale.class,
      axieBreedCount: axieSale.breedCount,
      axieParts: axieSale.parts.map((part) => ({
        partId: part.id,
        partName: part.name,
        partClass: part.class,
        partType: part.type,
        partSpecGenes: part.specialGenes,
        partStage: part.stage
      })),
      axieStats: axieSale.stats,
    }
  })
}
