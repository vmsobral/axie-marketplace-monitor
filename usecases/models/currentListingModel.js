module.exports = function (axiesListingResponse) {
  const axiesListing = axiesListingResponse.data.data.axies.results

  return axiesListing.map((axieSale) => {
    return {
      axieId: axieSale.id,
      axieImage: axieSale.image,
      axieGenes: axieSale.genes,
      price: axieSale.auction.currentPrice,
      priceUSD: axieSale.auction.currentPriceUSD
    }
  })
}
