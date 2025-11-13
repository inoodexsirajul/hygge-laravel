<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMail;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\customerCustomization;
use App\Models\User;
use App\Notifications\CustomVerifyEmail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use function Symfony\Component\String\b;

class AuthController extends Controller
{
    /**
     * Register new customer
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $customer = Customer::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create token
        $token = $customer->createToken('API Token')->plainTextToken;

        // $customer->sendEmailVerificationNotification();
        $customer->notify(new CustomVerifyEmail());

        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful',
            'data' => [
                'user' => $customer,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 201);
    }

    // Email verification API (for link)
    public function verifyEmail(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        if (! $request->hasValidSignature()) {
            return response()->json(['status' => 'error', 'message' => 'Invalid or expired verification link'], 403);
        }

        if ($customer->hasVerifiedEmail()) {
            return response()->json(['status' => 'success', 'message' => 'Email already verified']);
        }

        $customer->markEmailAsVerified();

        return response()->json(['status' => 'success', 'message' => 'Email verified successfully']);
    }

    public function resendVerificationEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:customers,email',
        ]);

        $customer = Customer::where('email', $request->email)->first();

        if ($customer->hasVerifiedEmail()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email already verified.'
            ], 400);
        }

        $customer->notify(new CustomVerifyEmail());

        return response()->json([
            'status' => 'success',
            'message' => 'Verification email resent successfully.'
        ]);
    }



    /**
     * Customer login
     */
    // public function login(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email',
    //         'password' => 'required|string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Validation failed',
    //             'errors' => $validator->errors(),
    //         ], 422);
    //     }

    //     $customer = Customer::where('email', $request->email)->first();

    //     if (!$customer || !Hash::check($request->password, $customer->password)) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Invalid credentials'
    //         ], 401);
    //     }

    //     // Delete old tokens to enforce single session
    //     $customer->tokens()->delete();

    //     // Create new token
    //     $token = $customer->createToken('API Token')->plainTextToken;

    //     $this->mergeGuestData($request, $customer->id);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Login successful',
    //         'data' => [
    //             'user' => $customer,
    //             'access_token' => $token,
    //             'token_type' => 'Bearer',
    //         ]
    //     ]);
    // }

    // protected function mergeGuestData(Request $request, $userId)
    // {
    //     $sessionId = $request->header('X-Session-Id'); // guest এর sessionId পাঠানো উচিত
    //     if (!$sessionId) return;

    //     // Merge Cart
    //     Cart::where('session_id', $sessionId)->update([
    //         'user_id' => $userId,
    //         'session_id' => null,
    //     ]);

    //     // Merge Customer Customizations
    //     customerCustomization::where('session_id', $sessionId)->update([
    //         'user_id' => $userId,
    //         'session_id' => null,
    //     ]);
    // }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $customer = Customer::where('email', $request->email)->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }
        if (!$customer->hasVerifiedEmail()) {
            return response()->json(['message' => 'Please verify your email first'], 403);
        }

        // check if user is active
        if ($customer->status != 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Your account is inactive. Please contact support.'
            ], 403); // 403 Forbidden
        }

        // Delete old tokens to enforce single session
        $customer->tokens()->delete();

        // Create new token
        $token = $customer->createToken('API Token')->plainTextToken;

        // ===== Merge guest cart & customization =====
        $sessionId = $request->header('X-Session-Id');
        if ($sessionId) {
            $this->mergeGuestCartToUser($customer->id, $sessionId);
            $this->mergeGuestCustomizationToUser($customer->id, $sessionId);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => [
                'user' => $customer,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }

    private function mergeGuestCartToUser($userId, $sessionId)
    {
        $guestCart = Cart::where('session_id', $sessionId)->get();

        foreach ($guestCart as $item) {
            $existing = Cart::where('user_id', $userId)
                ->where('product_id', $item->product_id)
                ->where('options', $item->options) // optional: size/color/customization match
                ->first();

            if ($existing) {
                // Increase quantity
                $existing->increment('quantity', $item->quantity);
                $item->delete();
            } else {
                // Assign guest item to user
                $item->update([
                    'user_id' => $userId,
                    'session_id' => null,
                ]);
            }
        }
    }

    private function mergeGuestCustomizationToUser($userId, $sessionId)
    {
        $guestCustomizations = CustomerCustomization::where('session_id', $sessionId)->get();

        foreach ($guestCustomizations as $custom) {
            $existing = CustomerCustomization::where('user_id', $userId)
                ->where('product_id', $custom->product_id)
                ->first();

            if ($existing) {
                // Merge old + new data
                $oldData = json_decode($existing->custom_data, true) ?? [];
                $newData = json_decode($custom->custom_data, true) ?? [];
                $mergedData = array_merge($oldData, $newData);

                // Handle images: replace if guest sent new
                $frontImage = $custom->front_image ?: $existing->front_image;
                $backImage  = $custom->back_image ?: $existing->back_image;

                // Delete old images if replaced
                if ($custom->front_image && $existing->front_image && file_exists(public_path($existing->front_image))) {
                    @unlink(public_path($existing->front_image));
                }
                if ($custom->back_image && $existing->back_image && file_exists(public_path($existing->back_image))) {
                    @unlink(public_path($existing->back_image));
                }

                $existing->update([
                    'custom_data' => json_encode($mergedData),
                    'front_image' => $frontImage,
                    'back_image' => $backImage,
                    'price' => $custom->price ?: $existing->price,
                ]);

                // Delete guest customization
                $custom->delete();
            } else {
                // Assign guest customization to user
                $custom->update([
                    'user_id' => $userId,
                    'session_id' => null,
                ]);
            }
        }
    }


    /**
     * Customer logout
     */
    public function logout(Request $request)
    {
        $customer = $request->user();
        if ($customer) {
            $customer->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated customer info
     */
    public function user(Request $request)
    {
        // $customer = $request->user(); // or Auth::user()
        $customer = Auth::user();
        return response()->json([
            'status' => 'success',
            'data' => $customer
        ]);
    }
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:customers,email']);

        $customer = Customer::where('email', $request->email)->first();
        DB::table('password_reset_tokens')->where('email', $customer->email)->delete();
        $plainToken = Str::random(60);
        DB::table('password_reset_tokens')->insert([
            'email' => $customer->email,
            'token' => Hash::make($plainToken),
            'created_at' => Carbon::now(),
        ]);

        Mail::to($customer->email)->send(new ResetPasswordMail($plainToken, $customer->email));

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset link sent to your email.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:customers,email',
            'token' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $status = Password::broker('customers')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($customer, $password) {
                $customer->forceFill([
                    'password' => bcrypt($password),
                ])->save();
                // Log::info('Password reset for customer: ' . $customer->email);
                $customer->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'status' => 'success',
                'message' => 'Password reset successful',
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => __($status)
            ], 400);
        }
    }
}
