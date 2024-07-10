<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{ Template };
use App\Http\Requests\TemplateRequest;

use Illuminate\Support\Facades\Blade;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $data = Template::orderBy('created_at', $request->order_by ?? 'DESC');

        if ($request->ajax() || ($request->has('search') && $request->search !== '')) {
            $searchValues = preg_split('/\s+/', $request->search, -1, PREG_SPLIT_NO_EMPTY);

            $data->where(function ($query) use ($searchValues) {
                foreach ($searchValues as $value) {
                    $query->where('name', 'like', "%{$value}%");
                }
            });
        }

        return $data->paginate($request->per_page ?? 10);
    }

    public function show($id) 
    {
        return Blade::render(Template::find($id)->contents, []);
        return Template::find($id);
    }

    public function create(TemplateRequest $request)
    {
        $data = Template::create($request->all());

        return response()->json([
            'message' => 'Created Successfully!',
            'success' => true,
        ], 200); 
    }

    public function update($id, TemplateRequest $request)
    {
        $data = Template::find($id);
        $data->update($request->all());

        return response()->json([
            'message' => 'Updated Successfully!',
            'success' => true,
        ], 200); 
    }

    public function destroy(Request $request)
    {
        $data = Template::find($request->id);

        if ($data && $data->delete()) {
            return response()->json([
                'message' => 'Deleted Successfully!',
                'success' => true,
            ], 200);
        }

        return response()->json([
            'message' => 'Theres an error deleting this item.',
            'success' => false,
        ], 200);
    }
}
