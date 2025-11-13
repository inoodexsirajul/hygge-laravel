<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Size;
use App\Models\Product;
use App\Models\Slider;
use App\Models\LogoSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    // public function index()
    // {
    //     $sliders = Cache::rememberForever('sliders', function () {
    //         return Slider::active()->orderBy('serial', 'asc')->get();
    //     });
    //     $sliders = Slider::active('status', 1)->orderBy('serial', 'asc')->select('banner', 'title', 'btn_url', 'id', 'type')->get();

    //     $brands = Brand::active()
    //         ->featured()
    //         ->select('id', 'name', 'logo')
    //         ->get();

    //     $allCategories = Category::active()
    //         ->select('id', 'name', 'icon', 'image')
    //         ->with(['subCategories' => function ($query) {
    //             $query->active()
    //                 ->select('id', 'category_id', 'name')
    //                 ->with(['childCategories' => function ($q) {
    //                     $q->active()
    //                         ->select('id', 'sub_category_id', 'name');
    //                 }]);
    //         }])
    //         ->get();

    //     $allCategories = Category::active()->select('id', 'name', 'image')->get();

    //     $typeBaseProducts = $this->getTypeBaseProduct();

    //     //  Home Categories with Products (category-wise)
    //     $homeProudct = Category::where(['front_show' => 1, 'status' => 1])
    //         ->orderBy('id', 'ASC')
    //         ->with(['products' => function ($q) {
    //             $q->active()
    //                 ->select(
    //                     'id',
    //                     'name',
    //                     'slug',
    //                     'category_id',
    //                     'price',
    //                     'offer_price',
    //                     'img_alt_text',
    //                     'qty'
    //                 )
    //                 ->with(['productImageGalleries', 'colors:id,color_name,price,is_default', 'sizes:id,size_name,price,is_default'])
    //                 ->withreview()
    //                 ->take(10); 
    //         }])
    //         ->get();

    //     return response()->json([
    //         'sliders' => $sliders,
    //         'brands' => $brands,
    //         'allCategories' => $allCategories,
    //         'typeBaseProducts' => $typeBaseProducts,
    //         'homeProudct' => $homeProudct

    //     ]);
    // }
    public function sliders()
    {
        // $sliders = Cache::rememberForever('sliders', function () {
        //     return Slider::active()
        //         ->orderBy('serial', 'asc')
        //         ->select('banner', 'title', 'btn_url', 'id', 'type')
        //         ->get();
        // });
        $sliders = Cache::remember('sliders', 3600, function () {
            return Slider::active()
                ->orderBy('serial', 'asc')
                // ->select('banner', 'title', 'btn_url', 'id', 'type')
                ->get(['id', 'banner', 'title', 'btn_url', 'type']);
        });

        return response()->json(['sliders' => $sliders]);
    }

    public function brands()
    {
        $brands = Brand::active()
            ->featured()
            ->select('id', 'name', 'logo')
            ->get();

        return response()->json(['brands' => $brands]);
    }
    public function colors()
    {
        $colors = Color::select('id', 'color_name', 'color_code')->where('status', '1')->get();

        return response()->json([
            'data' => $colors
        ]);
    }

    public function sizes()
    {
        $sizes = Size::select('id', 'size_name')->where('status', '1')->get();

        return response()->json([
            'data' => $sizes]);
        }
    public function categories()
    {
        $categories = Category::active()
            ->select('id', 'name', 'image', 'slug')
            ->with([
                'subCategories' => function ($subQuery) {
                    $subQuery->active();
                    $subQuery->select('id', 'category_id', 'name', 'slug')->with([
                        'childCategories' => function ($childQuery) {
                            $childQuery->active();
                            $childQuery->select('id', 'sub_category_id', 'name', 'slug');
                        }
                    ]);
                }
            ])
            ->get();

        return response()->json(['categories' => $categories]);
    }

    public function homeProducts()
    {
        $homeProducts = Category::where(['front_show' => 1, 'status' => 1])
            ->select('id', 'name', 'slug', 'icon', 'image')
            ->orderBy('id', 'ASC')
            ->with(['products' => function ($q) {
                $q->active()
                    ->select('id', 'name', 'slug', 'category_id', 'price', 'offer_price', 'img_alt_text', 'qty', 'thumb_image')
                    ->with(['productImageGalleries', 'colors:id,color_name,price,is_default', 'sizes:id,size_name,price,is_default'])
                    ->withreview()
                    ->take(10); 
            }])
            ->get();

        return response()->json(['homeProducts' => $homeProducts]);
    }

    public function getTypeBaseProduct()
    {
        $typeBaseProducts = [];
        $typeBaseProducts['new_arrival'] = Product::withreview()->with(['category', 'colors', 'sizes', 'productImageGalleries'])->where(['product_type' => 'new_arrival', 'status' => 1, 'is_approved' => 1])->orderBy('id', 'DESC')->get();
        $typeBaseProducts['featured_product'] = Product::withreview()->with(['category', 'colors', 'sizes', 'productImageGalleries'])->where(['product_type' => 'featured_product', 'status' => 1, 'is_approved' => 1])->orderBy('id', 'DESC')->get();
        $typeBaseProducts['top_product'] = Product::withreview()->with(['category', 'colors', 'sizes', 'productImageGalleries'])->where(['product_type' => 'top_product', 'status' => 1, 'is_approved' => 1])->orderBy('id', 'DESC')->get();
        $typeBaseProducts['best_product'] = Product::withreview()->with(['category', 'colors', 'sizes', 'productImageGalleries'])->where(['product_type' => 'best_product', 'status' => 1, 'is_approved' => 1])->orderBy('id', 'DESC')->get();
        return $typeBaseProducts;
    }
    public function logos(){
        $logo=LogoSetting::select('id','logo', 'favicon', )->get();
        return response()->json(['logo'=>$logo]);
    }

}