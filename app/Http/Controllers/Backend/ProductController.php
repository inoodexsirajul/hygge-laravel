<?php

namespace App\Http\Controllers\Backend;

use App\DataTables\OutOfStockDataTable;
use App\DataTables\ProductDataTable;
use App\DataTables\ProductsPendingDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\ChildCategory;
use App\Models\Color;
use App\Models\Product;
use App\Models\productCustomization;
use App\Models\ProductImageGallery;
use App\Models\Size;
use App\Models\SubCategory;
use App\Traits\ImageUploadTrait;
use Brian2694\Toastr\Facades\Toastr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use ImageUploadTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(ProductDataTable $dataTable)
    {
        return $dataTable->render('backend.product.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('status', 1)->get();
        $brands = Brand::where('status', 1)->get();
        $colors = Color::where('status', 1)->get();
        $sizes = Size::where('status', 1)->get();
        return view('backend.product.create', compact('categories', 'brands', 'colors', 'sizes'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductCreateRequest $request)
    {
        // dd($request->all());
        $lastId = Product::max('id') + 1;
        $productCode = 'P' . str_pad($lastId, 4, '0', STR_PAD_LEFT);

        $imagePath = $this->uploadImage($request, 'image', 'uploads/products');
        $product = new Product();
        $product->thumb_image = $imagePath;
        $product->name = $request->name;
        $product->slug = Str::slug($request->name);
        $product->category_id = $request->category;
        $product->sub_category_id = $request->sub_category;
        $product->child_category_id = $request->child_category;
        $product->brand_id = $request->brand;
        $product->qty = $request->qty;
        $product->short_description = $request->short_description;
        $product->long_description = $request->long_description;
        $product->video_link = $request->video_link;
        $product->sku = $request->sku;
        $product->purchase_price = $request->purchase_price ?? null;
        $product->price = $request->price;
        $product->offer_price = $request->offer_price;
        $product->offer_start_date = $request->offer_start_date;
        $product->offer_end_date = $request->offer_end_date;
        $product->product_type = $request->product_type;
        $product->status = $request->status;
        $product->meta_title = $request->meta_title;
        $product->meta_description = $request->meta_description;
        $product->created_by = auth()->id();
        $product->product_code = $productCode;

        if (auth()->user()->hasRole('SuperAdmin') || auth()->user()->hasRole('Admin')) {
            $product->is_approved = 1;
        } else {
            $product->is_approved = 0;
        }

        $product->save();
        // Attach sizes and colors 
        // if ($request->has('proSize')) {
        //     $product->sizes()->attach($request->proSize);
        // }
        // if ($request->has('proColor')) {
        //     $product->colors()->attach($request->proColor);
        // }

        // Attach sizes, colors, and price variants
        // if ($request->has('variants')) {
        //     foreach ($request->variants as $variant) {
        //         $product->variants()->create([
        //             'size_id' => $variant['size_id'] ?? null,
        //             'color_id' => $variant['color_id'] ?? null,
        //             'price' => $variant['price'] ?? null,
        //         ]);
        //     }
        // }
        // Save Size + Price Variants price
        // if ($request->has('variants')) {
        //     foreach ($request->variants as $variant) {
        //         if (!empty($variant['size_id'])) {
        //             DB::table('product_sizes')->insert([
        //                 'product_id' => $product->id,
        //                 'size_id' => $variant['size_id'],
        //                 'size_price' => $variant['price'] ?? 0,
        //                 'created_at' => now(),
        //                 // 'updated_at' => now(),
        //             ]);
        //         }

        //         if (!empty($variant['color_id'])) {
        //             DB::table('product_colors')->insert([
        //                 'product_id' => $product->id,
        //                 'color_id' => $variant['color_id'],
        //                 'color_price' => $variant['price'] ?? 0,
        //                 'created_at' => now(),
        //                 // 'updated_at' => now(),
        //             ]);
        //         }
        //     }
        // }

        // ===============================
        // Size + Price Sync
        // ===============================
        $sizeData = [];
        if ($request->has('variants')) {
            foreach ($request->variants as $variant) {
                if (!empty($variant['size_id'])) {
                    $sizeData[$variant['size_id']] = [
                        'size_price' => $variant['price'] ?? 0
                    ];
                }
            }
        }
        $product->sizes()->sync($sizeData);

        // ===============================
        // Color + Price Sync
        // ===============================
        $colorData = [];
        if ($request->has('variants')) {
            foreach ($request->variants as $variant) {
                if (!empty($variant['color_id'])) {
                    $colorData[$variant['color_id']] = [
                        'color_price' => $variant['price'] ?? 0
                    ];
                }
            }
        }
        $product->colors()->sync($colorData);

        // ===============================
        // Product Customization Save
        // ===============================
        $isCustomizable = $request->input('is_customizable', 0);

        if ($isCustomizable) {
            $frontPath = $request->hasFile('front_image')
                ? $this->uploadImage($request, 'front_image', 'uploads/customize', 700, 600)
                : null;

            $backPath = $request->hasFile('back_image')
                ? $this->uploadImage($request, 'back_image', 'uploads/customize', 700, 600)
                : null;

            $product->customization()->updateOrCreate(
                ['product_id' => $product->id],
                [
                    'is_customizable' => 1,
                    'front_image' => $frontPath,
                    'back_image' => $backPath,
                    'front_price' => $request->input('front_price', 0),
                    'back_price' => $request->input('back_price', 0),
                    'both_price' => $request->input('both_price', 0),
                ]
            );
        }


        // // now generate product code safely
        // $product->product_code = 'P' . str_pad($product->id, 4, '0', STR_PAD_LEFT);
        // $product->save();
        // $product->update([
        //     'product_code' => 'P' . str_pad($product->id, 4, '0', STR_PAD_LEFT)
        // ]);

        Toastr::success('Created Product Successfully!', 'success');
        return redirect()->route('admin.products.index');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::with('customization')->findOr($id);
        $subCategories = SubCategory::where('category_id', $product->category_id)->get();
        $childCategories = ChildCategory::where('sub_category_id', $product->sub_category_id)->get();
        $categories = Category::where('status', 1)->get();
        $brands = Brand::all();
        $colors = Color::where('status', 1)->get();
        $sizes = Size::where('status', 1)->get();
        return view('backend.product.edit', compact('product', 'categories', 'brands', 'subCategories', 'childCategories', 'colors', 'sizes'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductUpdateRequest $request, string $id)
    {
        $product = Product::find($id);

        /** handle image update*/
        $imagePath = $this->updateImage($request, 'image', 'uploads/products', $product->thumb_image);
        $product->thumb_image = empty(!$imagePath) ? $imagePath : $product->thumb_image;

        $product->name = $request->name;
        $product->slug = Str::slug($request->name);
        $product->category_id = $request->category;
        $product->sub_category_id = $request->sub_category;
        $product->child_category_id = $request->child_category;
        $product->brand_id = $request->brand;
        $product->qty = $request->qty;
        $product->short_description = $request->short_description;
        $product->long_description = $request->long_description;
        $product->video_link = $request->video_link;
        $product->sku = $request->sku;
        $product->price = $request->price;
        $product->offer_price = $request->offer_price;
        $product->offer_start_date = $request->offer_start_date;
        $product->offer_end_date = $request->offer_end_date;
        $product->product_type = $request->product_type;
        $product->status = $request->status;
        if (auth()->user()->hasRole('SuperAdmin') || auth()->user()->hasRole('Admin')) {
            $product->is_approved = 1;
        } else {
            if ($product->is_approved == 1) {
                $product->is_approved = 1;
            } else {
                $product->is_approved = 0;
            }
        }
        $product->meta_title = $request->meta_title;
        $product->meta_description = $request->meta_description;
        $product->save();

        // Sync sizes and colors
        // if ($request->has('proSize')) {
        //     $product->sizes()->sync($request->proSize);
        // } else {
        //     $product->sizes()->sync([]);
        // }

        // if ($request->has('proColor')) {
        //     $product->colors()->sync($request->proColor);
        // } else {
        //     $product->colors()->sync([]);
        // }

        // Remove old pivot data
        DB::table('product_sizes')->where('product_id', $product->id)->delete();
        DB::table('product_colors')->where('product_id', $product->id)->delete();

        // Save Size + Price Variants
        if ($request->has('variants')) {
            foreach ($request->variants as $variant) {
                if (!empty($variant['size_id'])) {
                    DB::table('product_sizes')->insert([
                        'product_id' => $product->id,
                        'size_id' => $variant['size_id'],
                        'size_price' => $variant['price'] ?? 0,
                        'updated_at' => now(),
                    ]);
                }

                if (!empty($variant['color_id'])) {
                    DB::table('product_colors')->insert([
                        'product_id' => $product->id,
                        'color_id' => $variant['color_id'],
                        'color_price' => $variant['price'] ?? 0,
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        /**============================
         * Handle Product Customization
         *============================*/
        if ($request->is_customizable == 1) {
            $customization = $product->customization ?? new ProductCustomization(['product_id' => $product->id]);

            $customization->is_customizable = 1;

            // Use updateImage method for front/back image
            $customization->front_image = $this->updateImage($request, 'front_image', 'uploads/customize', $customization->front_image ?? null, 700, 600) ?? $customization->front_image;
            $customization->back_image = $this->updateImage($request, 'back_image', 'uploads/customize', $customization->back_image ?? null, 700, 600) ?? $customization->back_image;

            $customization->front_price = $request->front_price ?? 0;
            $customization->back_price = $request->back_price ?? 0;
            $customization->both_price = $request->both_price ?? 0;

            $customization->save();
        } else {
            // Admin selected NO -> remove customization
            $product->customization?->delete(); // Smart null-safe delete
        }


        Toastr::success('Product Updated Successfully!', 'success');
        return redirect()->route('admin.products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        // if (OrderProduct::where('product_id', $product->id)->count() > 0) {
        //     return response(['status' => 'error', 'message' => 'Product have orders! Can not be deleted']);
        // }

        // Detach sizes and colors from pivot tables
        $product->sizes()->detach();
        $product->colors()->detach();

        // /**Delete main product image */
        $this->deleteImage($product->thumb_image);

        // /** delete product gallery images */
        $galleryImages = ProductImageGallery::where('product_id', $product->id)->get();
        foreach ($galleryImages as $image) {
            $this->deleteImage($image->image);
            $image->delete();
        }
        $product->customization?->delete();
        $product->delete();
        return response(['status' => 'success', 'message' => 'Deleted Successfully!']);
    }
    /**
     * Get all sub categories
     */
    public function getSubCategories(Request $request)
    {
        $subCategories = SubCategory::where('category_id', $request->id)->get();
        return $subCategories;
    }
    /**
     * Get all child categories
     */
    public function getChildCategories(Request $request)
    {
        $childCategories = ChildCategory::where('sub_category_id', $request->id)->get();
        return $childCategories;
    }
    /**
     * Change product status
     */
    function changeStatus(Request $request)
    {
        $product = Product::findOrFail($request->id);
        $product->status = $request->status == 'true' ? 1 : 0;
        $product->save();
        return response(['message' => 'Status has been Updated!']);
    }
    /**
     * product pending 
     */
    public function productsPending(ProductsPendingDataTable $dataTable)
    {
        return $dataTable->render('backend.product.pending.index');
    }
    /** change product approve status */
    public function changeApproveStatus(Request $request)
    {
        $product = Product::findOrFail($request->id);
        $product->is_approved = $request->value;
        $product->save();
        return response(['message' => 'Product Approved Status Has Been Changed!']);
    }

    public function outOfStock(OutOfStockDataTable $dataTable)
    {
        return $dataTable->render('backend.product.outofstock.index');
    }
}
