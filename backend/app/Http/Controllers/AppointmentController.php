<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AdditionalInfo;
use App\Http\Requests\AppointmentRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AppointmentController extends Controller
{
    protected $genderMap = [
        'male' => 'Masculino',
        'female' => 'Feminino',
        'other' => 'Outro'
    ];

    public function index(): JsonResponse
{
    $appointments = Appointment::with('additionalInfo')->get();
    foreach ($appointments as $appointment) {
        $appointment->photo = $appointment->photo ? url(Storage::url($appointment->photo)) : null;
        if ($appointment->additionalInfo) {
            $appointment->additionalInfo = $appointment->additionalInfo; // Carrega a relação corretamente
        }
    }
    return response()->json($appointments);
}

    public function store(AppointmentRequest $request): JsonResponse
    {
        $validatedData = $request->validated();
        $validatedData['gender'] = $this->genderMap[$request->gender] ?? null;

        if ($request->hasFile('photo')) {
            if ($request->file('photo')->isValid()) {
                try {
                    $photoPath = $request->file('photo')->store('photos', 'public');
                    $validatedData['photo'] = $photoPath;
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Erro ao fazer upload da foto.'], 500);
                }
            } else {
                return response()->json(['message' => 'Arquivo de foto inválido.'], 422);
            }
        }

        DB::beginTransaction();
        try {
            $appointment = Appointment::create($validatedData);

            if ($request->has('additionalInfo')) {
                $additionalInfoData = $request->input('additionalInfo');
                $additionalInfoData['appointment_id'] = $appointment->id;
                AdditionalInfo::create($additionalInfoData);
            }

            $appointment->photo = $appointment->photo ? url(Storage::url($appointment->photo)) : null; // Gera URL completa
            $appointment->gender = $this->genderMap[$appointment->gender] ?? $appointment->gender;

            DB::commit();
            return response()->json($appointment->load('additionalInfo'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao criar o agendamento.'], 500);
        }
    }

    public function show($id): JsonResponse
    {
        $appointment = Appointment::with('additionalInfo')->findOrFail($id);
        $appointment->photo = $appointment->photo ? url(Storage::url($appointment->photo)) : null;
        if ($appointment->additionalInfo) {
            $appointment->additionalInfo = $appointment->additionalInfo; // Carrega a relação corretamente
        }
        return response()->json($appointment);
    }

    public function update(AppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $validatedData = $request->validated();
        $validatedData['gender'] = $this->genderMap[$request->gender] ?? null;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('public/photos');
            $appointment->photo = $path;
        }
        

        DB::beginTransaction();
        try {
            $appointment->update($validatedData);

            if ($request->has('additionalInfo')) {
                $appointment->additionalInfo()->updateOrCreate(
                    ['appointment_id' => $appointment->id],
                    $request->input('additionalInfo')
                );
            }

            /* $appointment->photo = $appointment->photo ? url(Storage::url($appointment->photo)) : null; // Gera URL completa
            */ $appointment->gender = $this->genderMap[$appointment->gender] ?? $appointment->gender;

            DB::commit();
            return response()->json($appointment->load('additionalInfo'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao atualizar o agendamento.'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Agendamento não encontrado.'], 404);
        }

        try {
            $appointment->delete();
            return response()->json(['message' => 'Agendamento excluído com sucesso.'], 200);
        } catch (\Exception $e) {
            \Log::error('Erro ao excluir o agendamento: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao excluir o agendamento.'], 500);
        }
    }
}
