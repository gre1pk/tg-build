const { getSupabase } = require('./supabase');
const { mapFabricRow, mapFabricInput, mapPortfolioRow, mapPortfolioInput } = require('./mappers');

function validateFabricInput(mapped) {
  if (!mapped.name || !mapped.material || !mapped.color || !mapped.image_url) {
    throw new Error('name, material, color and imageUrl are required');
  }
  if (!Number.isFinite(mapped.price_per_meter) || mapped.price_per_meter < 0) {
    throw new Error('pricePerMeter must be a non-negative number');
  }
}

function validatePortfolioInput(mapped) {
  if (!mapped.title || !mapped.image_before_url || !mapped.image_after_url) {
    throw new Error('title, beforeImageUrl and afterImageUrl are required');
  }
}

async function listFabrics() {
  const { data, error } = await getSupabase()
    .from('fabrics')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapFabricRow);
}

async function getFabricById(id) {
  const { data, error } = await getSupabase().from('fabrics').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapFabricRow(data) : null;
}

async function createFabric(input) {
  const mapped = mapFabricInput(input);
  validateFabricInput(mapped);

  const { data, error } = await getSupabase().from('fabrics').insert(mapped).select().single();
  if (error) throw new Error(error.message);
  return mapFabricRow(data);
}

async function updateFabric(id, input) {
  const mapped = mapFabricInput(input);
  validateFabricInput(mapped);

  const { data, error } = await getSupabase()
    .from('fabrics')
    .update(mapped)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapFabricRow(data);
}

async function deleteFabric(id) {
  const { error, count } = await getSupabase()
    .from('fabrics')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

async function listPortfolio() {
  const { data, error } = await getSupabase()
    .from('portfolio')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPortfolioRow);
}

async function createPortfolioItem(input) {
  const mapped = mapPortfolioInput(input);
  validatePortfolioInput(mapped);

  const { data, error } = await getSupabase().from('portfolio').insert(mapped).select().single();
  if (error) throw new Error(error.message);
  return mapPortfolioRow(data);
}

async function updatePortfolioItem(id, input) {
  const mapped = mapPortfolioInput(input);
  validatePortfolioInput(mapped);

  const { data, error } = await getSupabase()
    .from('portfolio')
    .update(mapped)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapPortfolioRow(data);
}

async function deletePortfolioItem(id) {
  const { error, count } = await getSupabase()
    .from('portfolio')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

async function uploadImage({ bucket, fileName, contentType, dataBase64 }) {
  if (!bucket || !fileName || !dataBase64) {
    throw new Error('bucket, fileName and dataBase64 are required');
  }

  const allowed = ['fabric-images', 'portfolio-images'];
  if (!allowed.includes(bucket)) {
    throw new Error('Invalid bucket');
  }

  const buffer = Buffer.from(dataBase64, 'base64');
  if (buffer.length === 0) {
    throw new Error('Empty file');
  }
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('File too large (max 10 MB)');
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${Date.now()}-${safeName}`;

  const { error } = await getSupabase().storage.from(bucket).upload(path, buffer, {
    contentType: contentType || 'application/octet-stream',
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = getSupabase().storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

module.exports = {
  listFabrics,
  getFabricById,
  createFabric,
  updateFabric,
  deleteFabric,
  listPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  uploadImage,
};
