<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartController extends Controller
{
    // /** Add product to cart with variants and optional coupon */
    // public function addToCart(Request $request)
    // {
    //     $request->validate([
    //         'product_id' => 'required|integer|exists:products,id',
    //         'qty' => 'required|integer|min:1',
    //         'size_id' => 'nullable|integer|exists:sizes,id',
    //         'color_id' => 'nullable|integer|exists:colors,id',
    //         'coupon_code' => 'nullable|string'
    //     ]);

    //     $product = Product::with(['sizes', 'colors'])->findOrFail($request->product_id);

    //     if ($product->qty < $request->qty) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => $product->qty === 0 ? 'Product out of stock!' : 'Requested quantity not available!',
    //         ], 400);
    //     }

    //     // Variant prices
    //     $sizePrice = 0;
    //     $sizeName = null;
    //     if ($request->size_id) {
    //         $size = $product->sizes()->where('sizes.id', $request->size_id)->first();
    //         if ($size) {
    //             $sizeName = $size->size_name;
    //             $sizePrice = $size->pivot->size_price ?? 0;
    //         }
    //     }

    //     $colorPrice = 0;
    //     $colorName = null;
    //     if ($request->color_id) {
    //         $color = $product->colors()->where('colors.id', $request->color_id)->first();
    //         if ($color) {
    //             $colorName = $color->color_name;
    //             $colorPrice = $color->pivot->color_price ?? 0;
    //         }
    //     }

    //     $basePrice = $product->offer_price ?? $product->price;
    //     $variantTotal = $sizePrice + $colorPrice;

    //     $user_id = auth()->id();
    //     $session_id = $user_id ? null : ($request->header('X-Session-Id') ?? (string) Str::uuid());

    //     $cartQuery = Cart::query()
    //         ->when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id));

    //     $cartItem = (clone $cartQuery)
    //         ->where('product_id', $product->id)
    //         ->where('options->size_id', $request->size_id)
    //         ->where('options->color_id', $request->color_id)
    //         ->first();

    //     if ($cartItem) {
    //         $cartItem->increment('quantity', $request->qty);
    //     } else {
    //         $cartItem = Cart::create([
    //             'user_id' => $user_id,
    //             'session_id' => $session_id,
    //             'product_id' => $product->id,
    //             'quantity' => $request->qty,
    //             'price' => $basePrice,
    //             'options' => json_encode([
    //                 'image' => $product->thumb_image ?? null,
    //                 'size_id' => $request->size_id,
    //                 'size_name' => $sizeName,
    //                 'size_price' => $sizePrice,
    //                 'color_id' => $request->color_id,
    //                 'color_name' => $colorName,
    //                 'color_price' => $colorPrice,
    //                 'variant_total' => $variantTotal
    //             ]),
    //         ]);
    //     }

    //     $cartItems = (clone $cartQuery)->get();

    //     // Calculate cart total including variants
    //     $cartTotal = $cartItems->sum(function ($item) {
    //         $options = json_decode($item->options, true);
    //         return ($item->price + ($options['variant_total'] ?? 0)) * $item->quantity;
    //     });

    //     // Apply coupon if provided (stateless)
    //     $discount = 0;
    //     $couponCode = $request->coupon_code;
    //     if ($couponCode) {
    //         $coupon = Coupon::where(['code' => $couponCode, 'status' => 1])->first();
    //         if ($coupon && $coupon->start_date <= now()->format('Y-m-d') && $coupon->end_date >= now()->format('Y-m-d') && $coupon->total_used < $coupon->quantity) {
    //             if ($coupon->discount_type === 'amount') {
    //                 $discount = $coupon->discount;
    //             } else { // percentage
    //                 $discount = $cartTotal * $coupon->discount / 100;
    //             }
    //             $cartTotal = max(0, $cartTotal - $discount);
    //         } else {
    //             $couponCode = null; // invalid coupon ignored
    //         }
    //     }

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Product added to cart successfully!',
    //         'cart_count' => $cartItems->count(),
    //         'cart_total' => number_format($cartTotal, 2),
    //         'discount' => number_format($discount, 2),
    //         'coupon_code' => $couponCode,
    //         'cart_item' => $cartItem,
    //         'session_id' => $session_id,
    //     ]);
    // }

    // /** Get all cart items with totals */
    // public function getCart(Request $request)
    // {
    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     $cartItems = Cart::with('product:id,name,thumb_image,price,offer_price,qty,slug')
    //         ->when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
    //         ->get();

    //     $cartTotal = $cartItems->sum(function ($item) {
    //         $options = json_decode($item->options, true);
    //         return ($item->price + ($options['variant_total'] ?? 0)) * $item->quantity;
    //     });

    //     return response()->json([
    //         'cart_items' => $cartItems,
    //         'cart_count' => $cartItems->count(),
    //         'cart_total' => number_format($cartTotal, 2)
    //     ]);
    // }

    // /** Update cart quantity */
    // public function updateCart(Request $request)
    // {
    //     $request->validate([
    //         'cart_id' => 'required|integer',
    //         'quantity' => 'required|integer|min:1',
    //     ]);

    //     $cartItem = Cart::findOrFail($request->cart_id);
    //     $product = Product::findOrFail($cartItem->product_id);

    //     if ($product->qty < $request->quantity) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Product quantity not available!'
    //         ]);
    //     }

    //     $cartItem->update(['quantity' => $request->quantity]);

    //     $options = json_decode($cartItem->options, true);
    //     $total = ($cartItem->price + ($options['variant_total'] ?? 0)) * $cartItem->quantity;

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Cart updated successfully!',
    //         'product_total' => number_format($total, 2),
    //         'cart_item' => $cartItem
    //     ]);
    // }

    // /** Remove single cart item */
    // public function removeCart(Request $request, $cart_id)
    // {
    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     $cartQuery = Cart::query()
    //         ->when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id));

    //     $cartItem = $cartQuery->where('id', $cart_id)->firstOrFail();
    //     $cartItem->delete();

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Cart item removed successfully!'
    //     ]);
    // }

    // /** Clear all cart items */
    // public function clearCart(Request $request)
    // {
    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     $cartQuery = Cart::query()
    //         ->when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id));

    //     $deletedCount = $cartQuery->delete();

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Cart cleared successfully!',
    //         'deleted_count' => $deletedCount
    //     ]);
    // }

    // /** Cart subtotal */
    // public function cartTotal(Request $request)
    // {
    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     $total = Cart::when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
    //         ->get()
    //         ->sum(function ($item) {
    //             $options = json_decode($item->options, true);
    //             return ($item->price + ($options['variant_total'] ?? 0)) * $item->quantity;
    //         });

    //     return response()->json(['cart_total' => number_format($total, 2)]);
    // }

    // /** Cart count */
    // public function cartCount(Request $request)
    // {
    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     $count = Cart::when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
    //         ->count();

    //     return response()->json(['status' => 'success', 'cart_count' => $count]);
    // }

    // /** Stateless coupon calculation */
    // public function calculateCoupon(Request $request)
    // {
    //     $request->validate(['coupon_code' => 'required|string']);

    //     $user_id = auth()->id();
    //     $session_id = $request->header('X-Session-Id');

    //     $cartItems = Cart::when($user_id, fn($q) => $q->where('user_id', $user_id))
    //         ->when(!$user_id && $session_id, fn($q) => $q->where('session_id', $session_id))
    //         ->get();

    //     $cartTotal = $cartItems->sum(function ($item) {
    //         $options = json_decode($item->options, true);
    //         return ($item->price + ($options['variant_total'] ?? 0)) * $item->quantity;
    //     });

    //     $coupon = Coupon::where(['code' => $request->coupon_code, 'status' => 1])->first();
    //     $discount = 0;

    //     if ($coupon && $coupon->start_date <= now()->format('Y-m-d') && $coupon->end_date >= now()->format('Y-m-d') && $coupon->total_used < $coupon->quantity) {
    //         if ($coupon->discount_type === 'amount') {
    //             $discount = $coupon->discount;
    //         } else {
    //             $discount = $cartTotal * $coupon->discount / 100;
    //         }
    //     }

    //     $totalAfterDiscount = max(0, $cartTotal - $discount);

    //     return response()->json([
    //         'cart_total' => number_format($cartTotal, 2),
    //         'discount' => number_format($discount, 2),
    //         'total_after_discount' => number_format($totalAfterDiscount, 2),
    //         'coupon_code' => $coupon ? $coupon->code : null
    //     ]);
    // }
}
