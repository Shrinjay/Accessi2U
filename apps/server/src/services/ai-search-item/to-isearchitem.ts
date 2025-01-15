export type AiSearchItem = {
  id: string;
  created_at: Date;
  product_url: string;
  product_price: number;
  product_price_currency: string;
  product_description: string;
  vendor_name: string;
  product_image_urls: string[];
  product_name: string;
  featured_product_image: string;
  product_image_urls_storage: string[];
  product_color: string[];
};

export type ISearchItem = {
  id: string;
  createdAt: number;

  productUrl: string;
  productPrice: number;
  productPriceCurrency: string;
  productDescription: string;
  productImageUrl: string;
  vendorName: string;
  productName: string;
  productColor: string[];
};

export const toISearchItem = (aiSearchItem: AiSearchItem): ISearchItem => ({
  id: String(aiSearchItem.id),
  createdAt: new Date(aiSearchItem.created_at).getTime(),
  productUrl: aiSearchItem.product_url,
  productPrice: aiSearchItem.product_price,
  productPriceCurrency: aiSearchItem.product_price_currency,
  productDescription: aiSearchItem.product_description,
  productImageUrl: aiSearchItem.featured_product_image,
  vendorName: aiSearchItem.vendor_name,
  productName: aiSearchItem.product_name,
  productColor: aiSearchItem.product_color ?? [],
});
