module.exports = function (axieDetailResponse) {
  const axieDetail = axieDetailResponse.data.data.axie

  return {
    axieId: axieDetail.id,
    axieImage: axieDetail.image,
    axieGenes: axieDetail.genes
  }
}
