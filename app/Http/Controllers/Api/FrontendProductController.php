<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ChildCategory;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// class FrontendProductController extends Controller
// {

//     // public function categoryProducts($slug, Request $request)
//     // {
//     //     $categories = Category::active()->where('slug', $slug)->first();
//     //     $product = Product::active()->where('category_id', $categories->id)
//     //         ->select('id', 'name', 'slug', 'thumb_image', 'price', 'offer_price', 'product_type')->with('productImageGalleries')
//     //         ->get();

//     //     return response()->json([
//     //         'product' => $product
//     //     ]);
//     // }
//     //  Category products
//     public function categoryProducts($slug)
//     {
//         $category = Category::active()->where('slug', $slug)->first();
//         if (!$category) {
//             return response()->json(['status' => false, 'message' => 'Category not found'], 404);
//         }

//         $products = Product::active()
//             ->where('category_id', $category->id)
//             ->select('id', 'name', 'slug', 'thumb_image', 'price', 'offer_price', 'product_type', 'offer_start_date', 'offer_end_date')
//             ->with(['productImageGalleries:id,product_id,image', 'colors:id,color_name,price', 'sizes:id,size_name,price'])
//             ->withAvg('reviews', 'rating')->withCount('reviews')
//             ->distinct()
//             ->paginate(24);

//         return response()->json([
//             'status' => true,
//             'category' => $category->only(['id', 'name', 'slug']),
//             'products' => $products
//         ]);
//     }

//     //  Subcategory products
//     public function subcategoryProducts($slug)
//     {
//         $subcategory = SubCategory::active()->where('slug', $slug)->first();
//         if (!$subcategory) {
//             return response()->json(['status' => false, 'message' => 'Subcategory not found'], 404);
//         }

//         $products = Product::active()
//             ->where('sub_category_id', $subcategory->id)
//             ->select('id', 'name', 'slug', 'thumb_image', 'price', 'offer_price', 'product_type')
//             ->with(['productImageGalleries:id,product_id,image', 'colors:id,color_name,price', 'sizes:id,size_name,price'])
//             ->withAvg('reviews', 'rating')->withCount('reviews')
//             ->distinct()
//             ->paginate(24);

//         return response()->json([
//             'status' => true,
//             'subcategory' => $subcategory->only(['id', 'name', 'slug']),
//             'products' => $products
//         ]);
//     }

//     //  Childcategory products
//     public function childcategoryProducts($slug)
//     {
//         $childcategory = ChildCategory::active()->where('slug', $slug)->first();
//         if (!$childcategory) {
//             return response()->json(['status' => false, 'message' => 'Childcategory not found'], 404);
//         }

//         $products = Product::active()
//             ->where('child_category_id', $childcategory->id)
//             ->select('id', 'name', 'slug', 'thumb_image', 'price', 'offer_price', 'product_type')
//             ->with(['productImageGalleries:id,product_id,image', 'colors:id,color_name,price', 'sizes:id,size_name,price'])
//             ->withAvg('reviews', 'rating')->withCount('reviews')
//             ->distinct()
//             ->paginate(24);

//         return response()->json([
//             'status' => true,
//             'childcategory' => $childcategory->only(['id', 'name', 'slug']),
//             'products' => $products
//         ]);
//     }
//     public function allProducts()
//     {
//         $products = Product::active()
//             ->select('id', 'name', 'slug', 'thumb_image', 'price', 'offer_price', 'product_type')
//             ->with(['productImageGalleries:id,product_id,image', 'colors:id,color_name,price', 'sizes:id,size_name,price'])
//             ->withAvg('reviews', 'rating')->withCount('reviews')
//             ->distinct()
//             ->paginate(24);

//         return response()->json([
//             'status' => true,
//             'products' => $products
//         ]);
//     }
//     /** 
//      * products deatils
//      */
//     public function productDetails(string $slug)
//     {
//         //old all fields:

//         // $product = Product::with(['category', 'productImageGalleries', 'colors', 'sizes', 'brand'])->where('slug', $slug)->active()->first();
//         // // $reviews=ProductReview::where('product_id', $product?->id)->where('status', 1)->paginate(10);

//         // return response()->json([
//         //     'porduct' => $product,

//         // ]);


//         //new update code with only need fields
//         $product = Product::with([
//             'category:id,name,slug,image,icon',
//             'productImageGalleries:id,image,product_id',
//             'customization',
//             'colors' => function ($query) {
//                 $query->select('colors.id as color_id', 'colors.color_name', 'colors.color_code', 'colors.price', 'colors.is_default')
//                     ->withPivot('product_id', 'id');
//             },
//             'sizes' => function ($query) {
//                 $query->select('sizes.id as size_id', 'sizes.size_name', 'sizes.price', 'sizes.is_default')
//                     ->withPivot('product_id', 'id');
//             },
//             'brand:id,name,slug,image'
//         ])
//             ->where('slug', $slug)
//             ->active()
//             ->first();
//         // $reviews = ProductReview::where('product_id', $product?->id)
//         //     ->where('status', 1)->get();
//         // Load reviews with user info
//         $reviews = ProductReview::with(['user:id,name,email'])
//             ->where('product_id', $product->id)
//             ->where('status', 1)
//             ->get()
//             ->map(function ($review) use ($product) {
//                 return [
//                     'id' => $review->id,
//                     'rating' => $review->rating,
//                     'comment' => $review->review,
//                     'created_at' => $review->created_at,
//                     'user' => [
//                         'id' => $review->user->id ?? null,
//                         'name' => $review->user->name ?? 'Anonymous',
//                         'image' => $review->user->image ?? null
//                     ],
//                 ];
//             });
//         return response()->json([
//             'product' => $product,
//             'reviews' => $reviews
//         ]);
//     }
// }
class FrontendProductController extends Controller
{

    // private function applyFilters($query, Request $request)
    // {
    //     // Keyword search
    //     if ($request->has('q')) {
    //         $keyword = $request->q;

    //         $query->where(function ($q) use ($keyword) {
    //             // Search in product name or slug
    //             $q->where('name', 'like', "%{$keyword}%")
    //                 ->orWhere('slug', 'like', "%{$keyword}%")
    //                 // Search in main category name or slug
    //                 ->orWhereHas('category', function ($catQuery) use ($keyword) {
    //                     $catQuery->where('name', 'like', "%{$keyword}%")
    //                         ->orWhere('slug', 'like', "%{$keyword}%")
    //                         // Search in subcategories
    //                         ->orWhereHas('subCategories', function ($subQuery) use ($keyword) {
    //                             $subQuery->where('name', 'like', "%{$keyword}%")
    //                                 ->orWhere('slug', 'like', "%{$keyword}%")
    //                                 // Search in child categories
    //                                 ->orWhereHas('childCategories', function ($childQuery) use ($keyword) {
    //                                     $childQuery->where('name', 'like', "%{$keyword}%")
    //                                         ->orWhere('slug', 'like', "%{$keyword}%");
    //                                 });
    //                         });
    //                 });
    //         });
    //     }

    //     // Price range filter
    //     if ($request->has('min_price') && $request->has('max_price')) {
    //         $query->whereBetween('price', [$request->min_price, $request->max_price]);
    //     }

    //     // Sorting and special filters
    //     if ($request->has('sort_by')) {
    //         switch ($request->sort_by) {
    //             case 'lowtohigh':
    //                 $query->orderBy('price', 'asc');
    //                 break;
    //             case 'hightolow':
    //                 $query->orderBy('price', 'desc');
    //                 break;
    //             case 'latest':
    //                 $query->orderBy('created_at', 'desc');
    //                 break;
    //             case 'oldest':
    //                 $query->orderBy('created_at', 'asc');
    //                 break;
    //             case 'featureproduct':
    //                 $query->where('product_type', 'featured_product')
    //                     ->orderBy('created_at', 'desc');
    //                 break;
    //             case 'recommended':
    //                 $query->withAvg('reviews', 'rating')
    //                     ->orderBy('reviews_avg_rating', 'desc');
    //                 break;
    //             default:
    //                 $query->orderBy('name', 'asc');
    //         }
    //     }

    //     return $query;
    // }
    //new update code 

    //filter only one category wise 
    // private function applyFilters($query, Request $request)
    // {


    //     // Category filter (only direct products)
    //     if ($request->filled('category_id') && !$request->filled('subcategory_id') && !$request->filled('childcategory_id')) {
    //         $query->where('category_id', $request->category_id);
    //     }
    //     // Subcategory filter (only direct products)
    //     elseif ($request->filled('subcategory_id') && !$request->filled('childcategory_id')) {
    //         $query->where('subcategory_id', $request->subcategory_id);
    //     }
    //     // Childcategory filter
    //     elseif ($request->filled('childcategory_id')) {
    //         $query->where('childcategory_id', $request->childcategory_id);
    //     }

    //     if ($request->filled('q')) {
    //         $keyword = $request->q;
    //         $query->where(function ($q) use ($keyword) {
    //             $q->where('name', 'like', "%{$keyword}%")
    //                 ->orWhere('slug', 'like', "%{$keyword}%");
    //         });
    //     }

    //     if ($request->filled('brand_ids')) {
    //         $brandIds = is_array($request->brand_ids) ? $request->brand_ids : [$request->brand_ids];
    //         $query->whereIn('brand_id', $brandIds);
    //     }

    //     if ($request->filled('color_ids')) {
    //         $colorIds = is_array($request->color_ids) ? $request->color_ids : [$request->color_ids];
    //         $query->whereHas('colors', function ($q) use ($colorIds) {
    //             $q->whereIn('colors.id', $colorIds);
    //         });
    //     }


    //     if ($request->filled('size_ids')) {
    //         $sizeIds = is_array($request->size_ids) ? $request->size_ids : [$request->size_ids];
    //         $query->whereHas('sizes', function ($q) use ($sizeIds) {
    //             $q->whereIn('sizes.id', $sizeIds);
    //         });
    //     }

    //     // =============================
    //     // 6️⃣ Customizable filter
    //     // =============================
    //     // if ($request->filled('is_customizable')) {
    //     //     $query->where('is_customizable', $request->is_customizable);
    //     // }


    //     if ($request->filled('min_price') && $request->filled('max_price')) {
    //         $query->whereBetween('price', [$request->min_price, $request->max_price]);
    //     }

    //     if ($request->filled('sort_by')) {
    //         switch ($request->sort_by) {
    //             case 'lowtohigh':
    //                 $query->orderBy('price', 'asc');
    //                 break;
    //             case 'hightolow':
    //                 $query->orderBy('price', 'desc');
    //                 break;
    //             case 'latest':
    //                 $query->orderBy('created_at', 'desc');
    //                 break;
    //             case 'oldest':
    //                 $query->orderBy('created_at', 'asc');
    //                 break;
    //             default:
    //                 $query->orderBy('name', 'asc');
    //         }
    //     }

    //     return $query;
    // }

    //seleted multiplue category wise
    private function applyFilters($query, Request $request)
    {

        if ($request->filled('category_ids') && !$request->filled('subcategory_ids') && !$request->filled('childcategory_ids')) {
            $query->whereIn('category_id', (array) $request->category_ids);
        }


        if ($request->filled('subcategory_ids') && !$request->filled('childcategory_ids')) {
            $query->whereIn('subcategory_id', (array) $request->subcategory_ids);
        }


        if ($request->filled('childcategory_ids')) {
            $query->whereIn('childcategory_id', (array) $request->childcategory_ids);
        }


        if ($request->filled('q')) {
            $keyword = $request->q;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                    ->orWhere('slug', 'like', "%{$keyword}%");
            });
        }


        if ($request->filled('brand_ids')) {
            $query->whereIn('brand_id', (array) $request->brand_ids);
        }


        if ($request->filled('color_ids')) {
            $query->whereHas('colors', fn($q) => $q->whereIn('colors.id', (array)$request->color_ids));
        }


        if ($request->filled('size_ids')) {
            $query->whereHas('sizes', fn($q) => $q->whereIn('sizes.id', (array)$request->size_ids));
        }




        if ($request->filled('min_price') && $request->filled('max_price')) {
            $query->whereBetween('price', [$request->min_price, $request->max_price]);
        }


        if ($request->filled('min_stock') && $request->filled('max_stock')) {
            $query->whereBetween('stock', [$request->min_stock, $request->max_stock]);
        } elseif ($request->filled('min_stock')) {
            $query->where('stock', '>=', $request->min_stock);
        } elseif ($request->filled('max_stock')) {
            $query->where('stock', '<=', $request->max_stock);
        }


             // Sorting and special filters
        if ($request->has('sort_by')) {
            switch ($request->sort_by) {
                case 'lowtohigh':
                    $query->orderBy('price', 'asc');
                    break;
                case 'hightolow':
                    $query->orderBy('price', 'desc');
                    break;
                case 'latest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'featureproduct':
                    $query->where('product_type', 'featured_product')
                        ->orderBy('created_at', 'desc');
                    break;
                case 'recommended':
                    $query->withAvg('reviews', 'rating')
                        ->orderBy('reviews_avg_rating', 'desc');
                    break;
                default:
                    $query->orderBy('name', 'asc');
            }
        }

        return $query;
    }



    /**
     * All Products (Shop Page)
     */
    public function allProducts(Request $request)
    {
        $query = Product::active()->orderBy('id', 'desc');
        $query = $this->applyFilters($query, $request);

        $products = $query->with(['category', 'colors', 'customization', 'sizes'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->paginate(25);

        return response()->json(['status' => true, 'products' => $products]);
    }

    /**
     * Category Products
     */
    public function categoryProducts($slug, Request $request)
    {
        $category = Category::active()->where('slug', $slug)->first();
        if (!$category) return response()->json(['status' => false, 'message' => 'Category not found'], 404);

        $query = Product::active()->where('category_id', $category->id);
        $query = $this->applyFilters($query, $request);

        $products = $query->with(['category', 'colors', 'customization', 'sizes'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->paginate(24);

        return response()->json([
            'status' => true,
            'category' => $category->only(['id', 'name', 'slug']),
            'products' => $products
        ]);
    }

    /**
     * Subcategory Products
     */
    public function subcategoryProducts($slug, Request $request)
    {
        $subcategory = SubCategory::active()->where('slug', $slug)->first();
        if (!$subcategory) return response()->json(['status' => false, 'message' => 'Subcategory not found'], 404);

        $query = Product::active()->where('sub_category_id', $subcategory->id);
        $query = $this->applyFilters($query, $request);

        $products = $query->with(['category', 'colors', 'customization', 'sizes'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->paginate(24);

        return response()->json([
            'status' => true,
            'subcategory' => $subcategory->only(['id', 'name', 'slug']),
            'products' => $products
        ]);
    }

    /**
     * Childcategory Products
     */
    public function childcategoryProducts($slug, Request $request)
    {
        $childcategory = ChildCategory::active()->where('slug', $slug)->first();
        if (!$childcategory) return response()->json(['status' => false, 'message' => 'Childcategory not found'], 404);

        $query = Product::active()->where('child_category_id', $childcategory->id);
        $query = $this->applyFilters($query, $request);

        $products = $query->with(['category', 'colors', 'customization', 'sizes'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->paginate(24);

        return response()->json([
            'status' => true,
            'childcategory' => $childcategory->only(['id', 'name', 'slug']),
            'products' => $products
        ]);
    }

    /**
     * Product Details
     */
    public function productDetails(string $slug)
    {
        $product = Product::with([
            'category:id,name,slug,image,icon',
            'productImageGalleries:id,image,product_id',
            'customization',
            'colors' => fn($q) => $q->select('colors.id as color_id', 'colors.color_name', 'colors.color_code', 'colors.price', 'colors.is_default')->withPivot('product_id', 'id'),
            'sizes' => fn($q) => $q->select('sizes.id as size_id', 'sizes.size_name', 'sizes.price', 'sizes.is_default')->withPivot('product_id', 'id'),
            'brand:id,name,slug,logo'
        ])->where('slug', $slug)->active()->first();

        if (!$product) return response()->json(['status' => false, 'message' => 'Product not found'], 404);

        $reviews = ProductReview::with(['user:id,name,email,image'])
            ->where('product_id', $product->id)
            ->where('status', 1)
            ->get()
            ->map(fn($review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->review,
                'created_at' => $review->created_at,
                'user' => [
                    'id' => $review->user->id ?? null,
                    'name' => $review->user->name ?? 'Anonymous',
                    'image' => $review->user->image ?? null
                ]
            ]);

        return response()->json(['product' => $product, 'reviews' => $reviews]);
    }

    /**
     * Search Products (Keyword + Filter + Sort)
     */
    public function productSearch(Request $request)
    {
        $query = Product::active();
        $query = $this->applyFilters($query, $request);

        $products = $query->with(['category', 'colors', 'customization', 'sizes'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->paginate(20);

        return response()->json($products);
    }
}