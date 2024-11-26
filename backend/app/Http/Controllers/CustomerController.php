<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $establishmentType = $request->input('establishmentType', null);

        $query = Menu::where('is_approved', true);

        if ($establishmentType) {
            $query->where('establishment_type', $establishmentType);
        }

        $menus = $query->get();

        return view('customer.menus.index', compact('menus', 'establishmentType'));
    }

    public function show($id)
    {
        $menu = Menu::findOrFail($id);

        return view('customer.menus.show', compact('menu'));
    }
}
