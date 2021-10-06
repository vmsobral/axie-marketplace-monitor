const { DateTime } = require('luxon')

module.exports = function (latestAxiesListed) {
  const axiesListed = latestAxiesListed.data.data.axies.results

  return axiesListed.map((axieListed) => {
    const lastTx = axieListed.transferHistory.results[0]

    return {
      _id: lastTx.txHash,
      form: lastTx.from,
      to: lastTx.to,
      dateTime: DateTime.fromMillis(lastTx.timestamp * 1000, { zone: 'UTC' }).toJSDate(),
      price: lastTx.withPrice,
      priceUSD: lastTx.withPriceUsd,
      axieId: axieListed.id,
      axieImage: axieListed.image,
      axieClass: axieListed.class,
      axieBreedCount: axieListed.breedCount,
      axieParts: axieListed.parts.map((part) => ({
        partId: part.id,
        partName: part.name,
        partClass: part.class,
        partType: part.type,
        partSpecGenes: part.specialGenes,
        partStage: part.stage
      })),
      axieStats: axieListed.stats,
    }
  })
}
