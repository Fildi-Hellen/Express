<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MoMoService;

class MomoController extends Controller
{
    protected $momoService;

    public function __construct(MoMoService $momoService)
    {
        $this->momoService = $momoService;
    }

    public function initiatePayment(Request $request)
    {
        $result = $this->momoService->createPaymentRequest(
            $request->amount,
            $request->currency,
            $request->externalId,
            $request->payer
        );

        if (isset($result['response'])) {
            return response()->json([
                'message' => 'Payment request successful',
                'data' => $result['response'],
                'uuid' => $result['uuid']
            ], 200);
        } else {
            return response()->json([
                'message' => 'Payment request failed',
                'error' => $result['error']
            ], 500);
        }
    }
}
