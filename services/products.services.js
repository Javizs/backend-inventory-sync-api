export async function getExternalProducts(){

   // Consulta la API externa de productos.
   const response = await fetch("https://dummyjson.com/products");
   const data =  await response.json();
   // Adapta la respuesta al formato que usa esta aplicacion.
   const products = data.products.map(product => ({
      externalID:product.id,
      name:product.title,
      price:product.price,
      stock:product.stock,
      category: product.category

   }));

   return products;
};
