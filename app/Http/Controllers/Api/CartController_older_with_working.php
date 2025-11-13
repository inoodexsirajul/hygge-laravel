<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Color;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /** Add product to cart */
    //working code without size and color : 
    // public function addToCart(Request $request)
    // {
    //     dd($request->all());
    //     $request->validate([
    //         'product_id' => 'required|integer',
    //         'qty' => 'required|integer|min:1',
    //     ]);

    //     $product = Product::with(['sizes', 'colors'])->findOrFail($request->product_id);

    //     if ($product->qty < $request->qty) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => $product->qty === 0 ? 'Product out of stock!' : 'Product quantity not available!'
    //         ]);
    //     }
    //     // Size ও Color Name (optional)
    //     $sizeName = $request->size_id ? $product->sizes->find($request->size_id)?->name : null;
    //     $colorName = $request->color_id ? $product->colors->find($request->color_id)?->name : null;

    //     $productPrice = checkDiscount($product) ? $product->offer_price : $product->price;

    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     // Generate session_id for guest if not provided
    //     if (!$user_id && !$session_id) {
    //         $session_id = (string) Str::uuid();
    //     }

    //     $cartQuery = Cart::query()
    //         ->when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id));

    //     $cartItem = $cartQuery->where('product_id', $product->id)->first();

    //     if ($cartItem) {
    //         $cartItem->increment('quantity', $request->qty);
    //         $cartItem->update(['price' => $productPrice]);
    //     } else {
    //         $cartItem = Cart::create([
    //             'user_id' => $user_id,
    //             'session_id' => $session_id,
    //             'product_id' => $product->id,
    //             'quantity' => $request->qty,
    //             'price' => $productPrice,
    //             'options' => [
    //                 'image' => $product->thumbnail ?? null,
    //                 'size_id' => $request->size_id,
    //                 'size_name' => $sizeName,
    //                 'color_id' => $request->color_id,
    //                 'color_name' => $colorName,
    //             ]

    //         ]);
    //     }

    //     $cartCount = (clone $cartQuery)->count();
    //     $cartTotal = (clone $cartQuery)->sum(DB::raw('price * quantity'));

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Product added to cart successfully!',
    //         'cart_count' => $cartCount,
    //         'cart_total' => $cartTotal,
    //         'cart_item' => $cartItem,
    //         'session_id' => $session_id
    //     ]);
    // }
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'qty' => 'required|integer|min:1',
            'size_id' => 'nullable|integer|exists:sizes,id',
            'color_id' => 'nullable|integer|exists:colors,id',
        ]);

        $product = Product::with(['sizes', 'colors'])->findOrFail($request->product_id);

        if ($product->qty < $request->qty) {
            return response()->json([
                'status' => 'error',
                'message' => $product->qty === 0 ? 'Product out of stock!' : 'Requested quantity not available!',
            ], 400);
        }

        $sizePrice = 0;
        $sizeName = null;
        if ($request->size_id) {
            $size = $product->sizes()->where('sizes.id', $request->size_id)->first();
            if ($size) {
                $sizeName = $size->size_name;
                $sizePrice = $size->pivot->size_price ?? 0;
            }
        }

        $colorPrice = 0;
        $colorName = null;
        if ($request->color_id) {
            $color = $product->colors()->where('colors.id', $request->color_id)->first();
            if ($color) {
                $colorName = $color->color_name;
                $colorPrice = $color->pivot->color_price ?? 0;
            }
        }

        $basePrice = $product->offer_price ?? $product->price;
        $variantTotal = $sizePrice + $colorPrice;

        $user_id = auth()->id();
        $session_id = $user_id ? null : ($request->header('X-Session-Id') ?? (string) Str::uuid());

        $cartQuery = Cart::query()
            ->when($user_id, fn($q) => $q->where('user_id', $user_id))
            ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id));

        $cartItem = (clone $cartQuery)
            ->where('product_id', $product->id)
            ->where('options->size_id', $request->size_id)
            ->where('options->color_id', $request->color_id)
            ->first();
        $extraPrice = 0;
        $customData = null;

        if ($request->customization_id) {
            $customization = CustomerCustomization::find($request->customization_id);
            if ($customization) {
                $customData = json_decode($customization->custom_data, true);
                $extraPrice = $customization->price; 
            }
        }

        if ($cartItem) {
            $cartItem->increment('quantity', $request->qty);
        } else {
            $cartItem = Cart::create([
                'user_id' => $user_id,
                'session_id' => $session_id,
                'product_id' => $product->id,
                'quantity' => $request->qty,
                'price' => $basePrice,
                'options' => json_encode([
                    'image' => $product->thumb_image ?? null,
                    'size_id' => $request->size_id,
                    'size_name' => $sizeName,
                    'size_price' => $sizePrice,
                    'color_id' => $request->color_id,
                    'color_name' => $colorName,
                    'color_price' => $colorPrice,
                    'variant_total' => $variantTotal,
                    'extra_price' => $extraPrice
                ]),
            ]);
        }

        $cartCount = (clone $cartQuery)->count();

        $cartTotal = (clone $cartQuery)->get()->sum(function ($item) {
            $options = json_decode($item->options, true);
            $sizePrice = $options['size_price'] ?? 0;
            $colorPrice = $options['color_price'] ?? 0;
            return ($item->price + $sizePrice + $colorPrice) * $item->quantity;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Product added to cart successfully!',
            'cart_count' => $cartCount,
            'cart_total' => number_format($cartTotal, 2),
            'cart_item' => $cartItem,
            'session_id' => $session_id,
        ], 200);
    }


    /** Get all cart items */
    public function getCart(Request $request)
    {
        $user_id = auth()->id();
        $session_id = $request->header('X-Session-Id');

        $cartItems = Cart::with(['product:id,name,thumb_image,price,offer_price,qty,slug'])
            ->when($user_id, fn($q) => $q->where('user_id', $user_id))
            ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
            ->get();
        // $cartSubtotal = $cartItems->sum(function ($item) {
        //     return $item->price * $item->quantity;
        // });

        // return response()->json([
        //     'cart_items' => $cartItems,
        //     'cart_count' => $cartItems->count(),
        //     'cart_subtotal' => $cartSubtotal
        // ]);
        // return response()->json($cartItems);

        return response()->json([
            'cart_items' => $cartItems
        ]);
    }

    /** Update cart quantity */
    public function updateCart(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::findOrFail($request->cart_id);
        $product = Product::findOrFail($cartItem->product_id);

        if ($product->qty < $request->quantity) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product quantity not available!'
            ]);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        $total = $cartItem->quantity * $cartItem->price;

        return response()->json([
            'status' => 'success',
            'message' => 'Cart updated successfully!',
            'product_total' => $total,
            'cart_item' => $cartItem
        ]);
    }

    /** Clear all cart items */
    public function clearCart(Request $request)
    {
        $user_id = auth()->id();
        $session_id = $request->header('X-Session-Id');

        $cartQuery = Cart::query()
            ->when($user_id, fn($q) => $q->where('user_id', $user_id))
            ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id));

        $deletedCount = $cartQuery->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Cart cleared successfully!',
            'deleted_count' => $deletedCount
        ]);
    }

    /** Remove product from cart */
    // public function removeCart(Request $request, $id)
    // {
    //     $cartItem = Cart::findOrFail($id);
    //     $cartItem->delete();

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Product removed successfully!'
    //     ]);
    // }
    public function removeCart(Request $request, $cart_id)
    {
        $user_id = auth()->id();
        $session_id = $request->header('X-Session-Id');

        $cartQuery = Cart::query()
            ->when($user_id, fn($q) => $q->where('user_id', $user_id))
            ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id));

        $cartItem = $cartQuery->where('id', $cart_id)->firstOrFail();
        $cartItem->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Cart item removed successfully!'
        ]);
    }

    /** Cart total */
    public function cartTotal(Request $request)
    {
        $user_id = auth()->id();
        $session_id = $request->header('X-Session-Id');

        $total = Cart::when($user_id, fn($q) => $q->where('user_id', $user_id))
            ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
            ->get()
            ->sum(function ($item) {
                $options = json_decode($item->options, true);
                $variantTotal = $options['variant_total'] ?? 0;
                $extraPrice= $options['extra_price'] ?? 0;
                return ($item->price + $extraPrice +  $variantTotal) * $item->quantity;
            });

        return response()->json(['cart_total' => number_format($total, 2)]);
    }


    /** Get cart item count */
    public function cartCount(Request $request)
    {
        $user_id = auth()->id();
        $session_id = $request->header('X-Session-Id');

        $count = Cart::when($user_id, fn($q) => $q->where('user_id', $user_id))
            ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
            ->count();

        return response()->json([
            'status' => 'success',
            'cart_count' => $count
        ]);
    }


    /** Apply coupon */
    public function applyCoupon(Request $request)
    {
        $request->validate(['coupon_code' => 'required|string']);
        $coupon = Coupon::where(['code' => $request->coupon_code, 'status' => 1])->first();

        if (!$coupon) {
            return response()->json(['status' => 'error', 'message' => 'Invalid coupon code!']);
        } elseif ($coupon->start_date > date('Y-m-d')) {
            return response()->json(['status' => 'error', 'message' => 'Coupon not started yet!']);
        } elseif ($coupon->end_date < date('Y-m-d')) {
            return response()->json(['status' => 'error', 'message' => 'Coupon expired!']);
        } elseif ($coupon->total_used >= $coupon->quantity) {
            return response()->json(['status' => 'error', 'message' => 'Coupon limit exceeded!']);
        }

        // Session::put('coupon', [
        //     'coupon_name' => $coupon->name,
        //     'coupon_code' => $coupon->code,
        //     'discount_type' => $coupon->discount_type,
        //     'discount' => $coupon->discount
        // ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Coupon applied successfully!',
            'coupon' => [
                'coupon_name' => $coupon->name,
                'coupon_code' => $coupon->code,
                'discount_type' => $coupon->discount_type,
                'discount' => $coupon->discount
            ]
        ]);

        return response()->json(['status' => 'success', 'message' => 'Coupon applied successfully!']);
    }

    /** Coupon calculation */
    // public function couponCalculation(Request $request)
    // {
    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     $subTotal = Cart::when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
    //         ->sum(DB::raw('price * quantity'));

    //     if (!session()->has('coupon')) {
    //         return response()->json([
    //             'status' => 'success',
    //             'cart_total' => $subTotal,
    //             'discount' => 0
    //         ]);
    //     }

    //     $coupon = session()->get('coupon');
    //     if ($coupon['discount_type'] === 'amount') {
    //         $total = max(0, $subTotal - $coupon['discount']);
    //         return response()->json([
    //             'status' => 'success',
    //             'cart_total' => $total,
    //             'discount' => $coupon['discount']
    //         ]);
    //     }

    //     if ($coupon['discount_type'] === 'percentage') {
    //         $discount = $subTotal * $coupon['discount'] / 100;
    //         $total = max(0, $subTotal - $discount);
    //         return response()->json([
    //             'status' => 'success',
    //             'cart_total' => $total,
    //             'discount' => $discount
    //         ]);
    //     }
    // }
    // public function couponCalculation(Request $request)
    // {
    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     // Calculate subtotal including variant prices
    //     $subTotal = Cart::when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
    //         ->get()
    //         ->sum(function ($item) {
    //             $options = json_decode($item->options, true);
    //             $variantTotal = $options['variant_total'] ?? 0;
    //             return ($item->price + $variantTotal) * $item->quantity;
    //         });

    //     // No coupon applied
    //     if (!session()->has('coupon')) {
    //         return response()->json([
    //             'status' => 'success',
    //             'cart_total' => $subTotal,
    //             'discount' => 0
    //         ]);
    //     }

    //     $coupon = session()->get('coupon');

    //     if ($coupon['discount_type'] === 'amount') {
    //         $total = max(0, $subTotal - $coupon['discount']);
    //         return response()->json([
    //             'status' => 'success',
    //             'cart_total' => $total,
    //             'discount' => $coupon['discount']
    //         ]);
    //     }

    //     if ($coupon['discount_type'] === 'percentage') {
    //         $discount = $subTotal * $coupon['discount'] / 100;
    //         $total = max(0, $subTotal - $discount);
    //         return response()->json([
    //             'status' => 'success',
    //             'cart_total' => $total,
    //             'discount' => $discount
    //         ]);
    //     }
    // }
    public function couponCalculation(Request $request)
    {
        $request->validate([
            'coupon_code' => 'nullable|string'
        ]);

        $user_id = auth()->id();
        $session_id = $request->header('X-Session-Id');

        // Calculate subtotal including variant prices
        $subTotal = Cart::when($user_id, fn($q) => $q->where('user_id', $user_id))
            ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
            ->get()
            ->sum(function ($item) {
                $options = json_decode($item->options, true);
                $variantTotal = $options['variant_total'] ?? 0;
                return ($item->price + $variantTotal) * $item->quantity;
            });

        $discount = 0;
        $total = $subTotal;

        if ($request->coupon_code) {
            $coupon = Coupon::where(['code' => $request->coupon_code, 'status' => 1])->first();

            if ($coupon) {
                // Coupon validity check
                if ($coupon->start_date > date('Y-m-d')) {
                    return response()->json(['status' => 'error', 'message' => 'Coupon not started yet!'], 400);
                } elseif ($coupon->end_date < date('Y-m-d')) {
                    return response()->json(['status' => 'error', 'message' => 'Coupon expired!'], 400);
                } elseif ($coupon->total_used >= $coupon->quantity) {
                    return response()->json(['status' => 'error', 'message' => 'Coupon limit exceeded!'], 400);
                }

                if ($coupon->discount_type === 'amount') {
                    $discount = $coupon->discount;
                    $total = max(0, $subTotal - $discount);
                } elseif ($coupon->discount_type === 'percentage') {
                    $discount = $subTotal * $coupon->discount / 100;
                    $total = max(0, $subTotal - $discount);
                }
            } else {
                return response()->json(['status' => 'error', 'message' => 'Invalid coupon code!'], 400);
            }
        }

        return response()->json([
            'status' => 'success',
            'cart_total' => number_format($total, 2),
            'subtotal' => number_format($subTotal, 2),
            'discount' => number_format($discount, 2)
        ]);
    }
}
