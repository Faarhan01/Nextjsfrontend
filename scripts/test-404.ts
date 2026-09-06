import { getProductByIdStrict } from './frontend/src/lib/data/products';
import { getCategoryBySlugStrict } from './frontend/src/lib/data/categories';

(async () => {
  const p = await getProductByIdStrict('999999-notreal');
  console.log('product:', p ? p.name : 'null');
  const c = await getCategoryBySlugStrict('this-does-not-exist');
  console.log('category:', c ? c.name : 'null');
})();
