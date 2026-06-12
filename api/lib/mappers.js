function mapFabricRow(row) {
  return {
    id: row.id,
    name: row.name,
    material: row.material,
    color: row.color,
    pricePerMeter: row.price_per_meter,
    imageUrl: row.image_url,
    description: row.description ?? undefined,
    petFriendly: row.pet_friendly ?? false,
  };
}

function mapFabricInput(input) {
  return {
    name: String(input.name ?? '').trim(),
    material: String(input.material ?? '').trim(),
    color: String(input.color ?? '').trim(),
    price_per_meter: Number(input.pricePerMeter),
    image_url: String(input.imageUrl ?? '').trim(),
    description: input.description ? String(input.description).trim() : null,
    pet_friendly: Boolean(input.petFriendly),
    sort_order: Number.isFinite(input.sortOrder) ? input.sortOrder : 0,
  };
}

function mapPortfolioRow(row) {
  return {
    id: row.id,
    title: row.title,
    fabricName: row.fabric_name ?? '',
    beforeImageUrl: row.image_before_url,
    afterImageUrl: row.image_after_url,
  };
}

function mapPortfolioInput(input) {
  return {
    title: String(input.title ?? '').trim(),
    fabric_name: input.fabricName ? String(input.fabricName).trim() : null,
    image_before_url: String(input.beforeImageUrl ?? '').trim(),
    image_after_url: String(input.afterImageUrl ?? '').trim(),
    sort_order: Number.isFinite(input.sortOrder) ? input.sortOrder : 0,
  };
}

module.exports = {
  mapFabricRow,
  mapFabricInput,
  mapPortfolioRow,
  mapPortfolioInput,
};
